import Submission from "./models/Submission.js";
import Notification from "../notifications/models/Notification.js";
import Internship from "../models/internship/Internship.js";
import User from "../models/user/User.js";

import asyncHandler from "../../utils/asyncHandler.js";
import AppError from "../../utils/AppError.js";
import { emitToUser, getIO } from "../../socket/socket.js";

import { readFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const DEADLINE_MS = 48 * 60 * 60 * 1000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const coursesDir = path.resolve(__dirname, "../../data/courses");

const normalizeSlug = (slug) =>
    String(slug || "")
        .trim()
        .toLowerCase()
        .replace(/_/g, "-");

const readCourseData = async (courseSlug) => {
    try {
        const raw = await readFile(
            path.join(coursesDir, `${normalizeSlug(courseSlug)}.json`),
            "utf8"
        );
        return JSON.parse(raw);
    } catch {
        return null;
    }
};

const getOrderedCourseTasks = (courseData) => {
    if (!Array.isArray(courseData?.modules)) return [];

    return courseData.modules.flatMap((module) => {
        const moduleId = module.moduleId || "";
        const seen = new Set();
        const tasks = [];

        (module.lessons || []).forEach((lesson) => {
            (lesson.tasks || []).forEach((task) => {
                const taskId = task.taskId || "";
                if (!taskId || seen.has(taskId)) return;
                seen.add(taskId);

                tasks.push({
                    courseSlug: normalizeSlug(courseData.slug || courseData.courseSlug || ""),
                    moduleId,
                    moduleTitle: module.moduleTitle || "",
                    lessonId: lesson.lessonId || "",
                    taskId,
                    taskTitle: task.title || "Task",
                    problemStatement: task.problemStatement || ""
                });
            });
        });

        return tasks;
    });
};

const isExpired = (submission, now = new Date()) =>
    submission?.expiresAt &&
    !["pending", "approved"].includes(submission.status) &&
    new Date(submission.expiresAt).getTime() <= now.getTime();

const markExpiredIfNeeded = async (submission, now = new Date()) => {
    if (!isExpired(submission, now)) return submission;

    submission.status = "expired";
    submission.expiredAt = submission.expiredAt || now;
    await submission.save();

    emitToUser(submission.student, "taskExpired", {
        submission,
        taskKey: `${submission.moduleId}_${submission.taskId}`
    });

    return submission;
};

const unlockTaskForStudent = async (studentId, courseSlug, taskInfo) => {
    if (!studentId || !courseSlug || !taskInfo) return null;

    let submission = await Submission.findOne({
        student: studentId,
        courseSlug,
        moduleId: taskInfo.moduleId,
        lessonId: taskInfo.lessonId || "",
        taskId: taskInfo.taskId
    });

    if (!submission) {
        const internship = await Internship.findOne({ slug: courseSlug });
        const unlockedAt = new Date();

        submission = await Submission.create({
            student: studentId,
            internship: internship?._id || null,
            courseSlug,
            moduleId: taskInfo.moduleId,
            moduleTitle: taskInfo.moduleTitle || "",
            lessonId: taskInfo.lessonId || "",
            taskId: taskInfo.taskId,
            taskTitle: taskInfo.taskTitle || "",
            problemStatement: taskInfo.problemStatement || "",
            status: "unlocked",
            unlockedAt,
            expiresAt: new Date(unlockedAt.getTime() + DEADLINE_MS)
        });
    } else if (submission.status === "locked") {
        const unlockedAt = new Date();
        submission.status = "unlocked";
        submission.unlockedAt = unlockedAt;
        submission.expiresAt = new Date(unlockedAt.getTime() + DEADLINE_MS);
        await submission.save();
    }

    return submission;
};

const unlockNextTask = async (submission) => {
    const courseData = await readCourseData(submission.courseSlug);
    const orderedTasks = getOrderedCourseTasks(courseData);
    const currentIndex = orderedTasks.findIndex(
        (task) =>
            task.moduleId === submission.moduleId &&
            task.taskId === submission.taskId
    );

    if (currentIndex < 0) return null;

    const nextTask = orderedTasks[currentIndex + 1];
    if (!nextTask) return null;

    return unlockTaskForStudent(
        submission.student,
        submission.courseSlug,
        nextTask
    );
};

// =====================================
// STUDENT: SUBMIT CODE (POST /api/submissions)
// =====================================
export const submitCode = asyncHandler(async (req, res) => {

    const {
        courseSlug,
        moduleId,
        moduleTitle,
        lessonId,
        taskId,
        taskTitle,
        problemStatement,
        code,
        answer,
        githubLink,
        liveLink
    } = req.body;

    // Course tasks live at the module level (modules[].tasks[]) in the course
    // JSON, so lessonId is NOT required. Only the module-level identifiers are
    // needed to uniquely identify a task's submission.
    const normalizedCourseSlug = normalizeSlug(courseSlug);

    if (!normalizedCourseSlug || !moduleId || !taskId) {
        throw new AppError(
            "courseSlug, moduleId and taskId are required",
            400
        );
    }

    if (!code || !code.trim()) {
        throw new AppError("code is required", 400);
    }

// Resolve the internship (by slug) so we can link it.
    let internship = null;
    try {
        internship = await Internship.findOne({ slug: normalizedCourseSlug });
    } catch {
        internship = null;
    }

    // Normalize lessonId to "" when not applicable (module-level course tasks).
    const normalizedLessonId = lessonId || "";

    // Upsert the submission so a task has only one active record.
    let submission = await Submission.findOne({
        student: req.user._id,
        courseSlug: normalizedCourseSlug,
        moduleId,
        lessonId: normalizedLessonId,
        taskId
    });

    if (!submission) {
        const courseData = await readCourseData(normalizedCourseSlug);
        const orderedTasks = getOrderedCourseTasks(courseData);
        const firstTask = orderedTasks[0];
        const requestedTask = orderedTasks.find(
            (task) => task.moduleId === moduleId && task.taskId === taskId
        );

        if (!firstTask || firstTask.taskId !== requestedTask?.taskId || firstTask.moduleId !== requestedTask?.moduleId) {
            throw new AppError("This task is locked until the previous task is approved.", 403);
        }

        submission = await unlockTaskForStudent(
            req.user._id,
            normalizedCourseSlug,
            requestedTask
        );
    }

    await markExpiredIfNeeded(submission);

    if (submission.status === "expired") {
        throw new AppError(
            "This task deadline has expired. Please contact support for an extension.",
            403
        );
    }

    if (submission.status === "locked") {
        throw new AppError("This task is locked until the previous task is approved.", 403);
    }

    if (submission.status === "approved") {
        throw new AppError("This task is already approved.", 400);
    }

    submission.moduleTitle = moduleTitle || submission.moduleTitle || "";
    submission.taskTitle = taskTitle || submission.taskTitle || "";
    submission.problemStatement =
        problemStatement || submission.problemStatement || "";
    submission.code = code;
    submission.answer = answer || submission.answer || "";
    submission.githubLink = githubLink || submission.githubLink || "";
    submission.liveLink = liveLink || submission.liveLink || "";

    // Submitting within the active deadline sends the task to admin review.
    submission.status = "pending";
    submission.submittedAt = new Date();
    submission.reviewedBy = null;
    submission.reviewedAt = null;
    submission.reviewComment = "";

    await submission.save();

    getIO()?.emit("taskSubmitted", {
        submissionId: submission._id,
        student: req.user._id,
        courseSlug: submission.courseSlug,
        moduleId: submission.moduleId,
        taskId: submission.taskId,
        title: submission.taskTitle,
        status: submission.status
    });

    const admins = await User.find({ role: "admin" });
    await Promise.all(
        admins.map((admin) =>
            Notification.create({
                user: admin._id,
                title: "Task Approval",
                message: `${req.user.firstName} ${req.user.lastName} submitted "${submission.taskTitle || submission.taskId}" for approval.`,
                type: "system"
            })
        )
    );

    return res.status(200).json({
        success: true,
        message: "Task submitted successfully. Waiting for admin approval.",
        submission
    });

});


// =====================================
// STUDENT: GET MY SUBMISSIONS (GET /api/submissions/my)
// =====================================
export const getMySubmissions = asyncHandler(async (req, res) => {

    const submissions = await Submission.find({
        student: req.user._id
    })
        .sort({ updatedAt: -1 });

    res.status(200).json({
        success: true,
        submissions
    });

});


// =====================================
// STUDENT: GET SUBMISSION BY COURSE (GET /api/submissions/course/:courseSlug)
// =====================================
export const getMyCourseSubmissions = asyncHandler(async (req, res) => {

    const courseSlug = normalizeSlug(req.params.courseSlug);

    const courseData = await readCourseData(courseSlug);
    const orderedTasks = getOrderedCourseTasks(courseData);

    if (orderedTasks.length) {
        await unlockTaskForStudent(req.user._id, courseSlug, orderedTasks[0]);
    }

    let submissions = await Submission.find({
        student: req.user._id,
        courseSlug
    });

    const submissionMap = new Map(
        submissions.map((submission) => [
            `${submission.moduleId}_${submission.taskId}`,
            submission
        ])
    );

    for (let index = 0; index < orderedTasks.length; index += 1) {
        const task = orderedTasks[index];
        const key = `${task.moduleId}_${task.taskId}`;
        const existing = submissionMap.get(key);

        if (existing) {
            if (existing.status !== "approved") break;
            continue;
        }

        const previousTask = orderedTasks[index - 1];
        const previous = previousTask
            ? submissionMap.get(`${previousTask.moduleId}_${previousTask.taskId}`)
            : null;

        if (index === 0 || previous?.status === "approved") {
            const unlocked = await unlockTaskForStudent(req.user._id, courseSlug, task);
            if (unlocked) {
                submissionMap.set(key, unlocked);
                submissions.push(unlocked);
            }
        }

        break;
    }

    submissions = await Promise.all(
        submissions.map((submission) => markExpiredIfNeeded(submission))
    );

    res.status(200).json({
        success: true,
        orderedTasks,
        submissions
    });

});


// =====================================
// ADMIN: GET ALL SUBMISSIONS (GET /api/admin/submissions)
// =====================================
export const getAllSubmissions = asyncHandler(async (req, res) => {

    const { status } = req.query;

    const now = new Date();
    await Submission.updateMany(
        {
            status: { $in: ["unlocked", "rejected"] },
            expiresAt: { $lte: now }
        },
        {
            $set: {
                status: "expired",
                expiredAt: now
            }
        }
    );

    const filter = {};
    if (
        status &&
        ["locked", "unlocked", "pending", "approved", "rejected", "expired"].includes(status)
    ) {
        filter.status = status;
    }

    const submissions = await Submission.find(filter)
        .populate("student", "firstName lastName username email avatar")
        .populate("internship", "title slug")
        .sort({ submittedAt: -1 });

    res.status(200).json({
        success: true,
        total: submissions.length,
        submissions
    });

});


// =====================================
// ADMIN: GET SUBMISSION DETAILS (GET /api/admin/submissions/:id)
// =====================================
export const getSubmissionDetails = asyncHandler(async (req, res) => {

    const submission = await Submission.findById(req.params.id)
        .populate("student", "firstName lastName username email avatar github linkedin")
        .populate("internship", "title slug description");

    if (!submission) {
        throw new AppError("Submission not found", 404);
    }

    res.status(200).json({
        success: true,
        submission
    });

});


// =====================================
// ADMIN: APPROVE SUBMISSION (PUT /api/admin/submissions/:id/approve)
// =====================================
export const approveSubmission = asyncHandler(async (req, res) => {

    const submission = await Submission.findById(req.params.id);

    if (!submission) {
        throw new AppError("Submission not found", 404);
    }

    submission.status = "approved";
    submission.reviewedBy = req.user._id;
    submission.reviewedAt = new Date();
    submission.reviewComment = req.body.comment || "";

    await submission.save();

    const unlockedSubmission = await unlockNextTask(submission);

    await Notification.create({
        user: submission.student,
        title: "Task Approved",
        message: `Your task "${submission.taskTitle || submission.taskId}" has been approved.`,
        type: "system"
    });

    emitToUser(submission.student, "taskApproved", {
        submission,
        unlockedSubmission,
        approvedTaskKey: `${submission.moduleId}_${submission.taskId}`,
        unlockedTaskKey: unlockedSubmission
            ? `${unlockedSubmission.moduleId}_${unlockedSubmission.taskId}`
            : null
    });

    res.status(200).json({
        success: true,
        message: "Submission approved successfully.",
        submission,
        unlockedSubmission
    });

});


// =====================================
// ADMIN: REJECT SUBMISSION (PUT /api/admin/submissions/:id/reject)
// =====================================
export const rejectSubmission = asyncHandler(async (req, res) => {

    const submission = await Submission.findById(req.params.id);

    if (!submission) {
        throw new AppError("Submission not found", 404);
    }

    submission.status = "rejected";
    submission.reviewedBy = req.user._id;
    submission.reviewedAt = new Date();
    submission.reviewComment = req.body.comment || "";

    await submission.save();

    await Notification.create({
        user: submission.student,
        title: "Task Review",
        message:
            req.body.comment ||
            `Your task "${submission.taskTitle || submission.taskId}" requires correction. Please update and submit again.`,
        type: "system"
    });

    emitToUser(submission.student, "taskRejected", {
        submission,
        taskKey: `${submission.moduleId}_${submission.taskId}`
    });

    res.status(200).json({
        success: true,
        message: "Submission rejected successfully.",
        submission
    });

});


// =====================================
// ADMIN: EXTEND DEADLINE (PUT /api/admin/submissions/:id/extend)
// =====================================
export const extendSubmissionDeadline = asyncHandler(async (req, res) => {

    const submission = await Submission.findById(req.params.id);

    if (!submission) {
        throw new AppError("Submission not found", 404);
    }

    if (["approved", "pending"].includes(submission.status)) {
        throw new AppError(
            "Only unlocked, rejected, or expired tasks can be extended.",
            400
        );
    }

    const now = new Date();
    const hours = Number(req.body.hours || 48);
    const extensionMs = Math.max(1, hours) * 60 * 60 * 1000;

    submission.status = "unlocked";
    submission.unlockedAt = submission.unlockedAt || now;
    submission.expiresAt = new Date(now.getTime() + extensionMs);
    submission.expiredAt = null;
    submission.extendedAt = now;
    submission.extendedBy = req.user._id;

    await submission.save();

    await Notification.create({
        user: submission.student,
        title: "Task Deadline Extended",
        message: `Your task "${submission.taskTitle || submission.taskId}" deadline has been extended.`,
        type: "system"
    });

    emitToUser(submission.student, "taskDeadlineExtended", {
        submission,
        taskKey: `${submission.moduleId}_${submission.taskId}`
    });

    res.status(200).json({
        success: true,
        message: "Deadline extended successfully.",
        submission
    });

});

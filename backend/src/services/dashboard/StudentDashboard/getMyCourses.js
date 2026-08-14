import StudentInternship from "../../../models/StudentInternship.js";
import Course from "../../../models/Course.js";

const getMyCourses = async (userId) => {

    const courses = await StudentInternship.find({
        student: userId,
        course: { $ne: null }
    })
        .populate({
            path: "course",
            select: `
                title
                slug
                thumbnail
                category
                level
                duration
                totalTasks
                totalNotes
                certificate
                badge
            `
        })
        .sort({ createdAt: -1 });

    return courses
        .filter(item => item.course)
        .map(item => {

            const remainingTasks = Math.max(
                (item.course.totalTasks || 0) -
                item.completedTasks,
                0
            );

            const remainingNotes = Math.max(
                (item.course.totalNotes || 0) -
                item.completedNotes,
                0
            );

            return {
                _id: item._id,

                // IMPORTANT
                type: "course",

                courseId: item.course._id,

                slug: item.course.slug,

                title: item.course.title,

                thumbnail: item.course.thumbnail,

                category: item.course.category,

                level: item.course.level,

                duration: item.course.duration,

                totalTasks: item.course.totalTasks,

                totalNotes: item.course.totalNotes,

                completedTasks: item.completedTasks,

                remainingTasks,

                remainingNotes,

                progress: item.progress,

                status: item.status,

                certificateEligible:
                    item.course.certificate,

                badgeEligible:
                    item.course.badge,

                certificateIssued:
                    item.certificateIssued,

                startedAt: item.startedAt,

                completedAt: item.completedAt,

                enrolledAt: item.createdAt
            };
        });
};

export default getMyCourses;
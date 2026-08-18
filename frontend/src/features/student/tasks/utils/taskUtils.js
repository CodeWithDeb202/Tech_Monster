export const normalizeSlug = (slug) =>
    String(slug || "")
        .trim()
        .toLowerCase()
        .replace(/_/g, "-");

export const getTaskKey = (submission) => {
    if (!submission?.moduleId || !submission?.taskId) return "";

    return `${submission.moduleId}_${submission.taskId}`;
};

export const formatCountdown = (expiresAt, now) => {
    if (!expiresAt) return "No deadline";

    const diff = new Date(expiresAt).getTime() - now;

    if (diff <= 0) return "Expired";

    const totalSeconds = Math.floor(diff / 1000);

    const days = Math.floor(totalSeconds / 86400);

    const hours = Math.floor(
        (totalSeconds % 86400) / 3600
    );

    const minutes = Math.floor(
        (totalSeconds % 3600) / 60
    );

    const seconds = totalSeconds % 60;

    if (days > 0) {
        return `${days}d ${hours}h ${minutes}m`;
    }

    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
        2,
        "0"
    )}:${String(seconds).padStart(2, "0")}`;
};

export const buildModules = (courseData) => {
    if (!courseData?.modules) return [];

    return courseData.modules.map((module) => {
        const moduleId = module.moduleId || "";
        const lessons = module.lessons || [];

        const deduped = [];
        const seen = new Set();

        lessons.forEach((lesson) => {
            const lessonId = lesson.lessonId || "";

            (lesson.tasks || []).forEach((task) => {
                const taskId = task.taskId || "task";

                if (seen.has(taskId)) return;

                seen.add(taskId);

                deduped.push({
                    id: `${moduleId}_${taskId}`,
                    moduleId,
                    lessonId,
                    taskId,
                    title: task.title || "Task",
                    level: task.level || "Task",
                    problemStatement: task.problemStatement || "",
                    hint: task.hint || "",
                    solutionCode: task.solutionCode || "",
                });
            });
        });

        return {
            id: moduleId || `module-${Date.now()}`,
            title: module.moduleTitle || "Module",
            tasks: deduped,
        };
    });
};
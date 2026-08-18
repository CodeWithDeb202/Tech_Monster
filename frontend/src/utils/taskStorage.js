// ==============================================
// Task completion persistence helper
// Stores per-course task statuses in localStorage.
// ==============================================

export const getTaskStorageKey = (courseSlug) =>
    `task_completion_${String(courseSlug || "")
        .trim()
        .toLowerCase()
        .replace(/_/g, "-")}`;

// Load task state
export const loadTaskState = (courseSlug) => {
    try {
        const raw = localStorage.getItem(getTaskStorageKey(courseSlug));

        return raw ? JSON.parse(raw) : {};
    } catch {
        return {};
    }
};

// Save task state
export const saveTaskState = (courseSlug, state) => {
    try {
        localStorage.setItem(
            getTaskStorageKey(courseSlug),
            JSON.stringify(state)
        );
    } catch (error) {
        console.error("Failed to save task state:", error);
    }
};

// Clear task state
export const clearTaskState = (courseSlug) => {
    try {
        localStorage.removeItem(getTaskStorageKey(courseSlug));
    } catch (error) {
        console.error("Failed to clear task state:", error);
    }
};

// Check whether all tasks are approved
export const isAllTasksApproved = (courseSlug, taskIds) => {
    if (!Array.isArray(taskIds) || taskIds.length === 0) {
        return false;
    }

    const state = loadTaskState(courseSlug);

    return taskIds.every((id) => state[id] === "approved");
};

import asyncHandler from "../../core/http/asyncHandler.js";

import {
    getUserInfo,
    getStats as getStudentStats,
    getAttendance as getStudentAttendance,
    getWeeklyAnalytics,
    getMyInternships,
    getMyCourses,
    getAllInternships,
    getAllCourses,
    getRecommendedInternships,
    getSuggestedUsers,
    getBadges
} from "./student/index.js";

import {
    getStats as getAdminStats,
    getAttendance as getAdminAttendance,
    getWeeklyAttendance,
    getRecentActivities,
    getActiveStudents,
    getTopInternships,
    getRecentTasks,
    getCertificates
} from "./admin/index.js";

export const studentDashboard = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    console.log("userId", userId);
    const [
        user,
        stats,
        attendance,
        analytics,
        internships,
        courses,
        allInternships,
        allCourses,
        recommendedInternships,
        suggestedUsers,
        badges
    ] = await Promise.all([
        getUserInfo(userId),
        getStudentStats(userId),
        getStudentAttendance(userId),
        getWeeklyAnalytics(userId),
        getMyInternships(userId),
        getMyCourses(userId),
        getAllInternships(userId),
        getAllCourses(userId),
        getRecommendedInternships(userId),
        getSuggestedUsers(userId),
        getBadges(userId)
    ]);

    return res.status(200).json({
        success: true,
        dashboard: {
            user,
            stats,
            attendance,
            analytics,
            internships,
            courses,
            allInternships,
            allCourses,
            recommendedInternships,
            suggestedUsers,
            badges
        }
    });

});


export const adminDashboard = asyncHandler(async (req, res) => {

    const [
        stats,
        attendanceSummary,
        weeklyAttendance,
        recentActivities,
        activeStudents,
        topInternships,
        recentTasks,
        certificateAnalytics

    ] = await Promise.all([
        getAdminStats(),
        getAdminAttendance(),
        getWeeklyAttendance(),
        getRecentActivities(),
        getActiveStudents(),
        getTopInternships(),
        getRecentTasks(),
        getCertificates()
    ]);

    return res.status(200).json({

        success: true,

        dashboard: {
            stats,
            attendanceSummary,
            weeklyAttendance,
            recentActivities,
            activeStudents,
            topInternships,
            recentTasks,
            certificateAnalytics
        }

    });

});

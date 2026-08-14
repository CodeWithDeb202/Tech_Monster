import asyncHandler from "../../utils/asyncHandler.js";

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
} from "../../services/dashboard/StudentDashboard/index.js";

import {
    getStats as getAdminStats,
    getAttendance as getAdminAttendance,
    getWeeklyAttendance,
    getRecentActivities,
    getActiveStudents,
    getTopInternships,
    getRecentTasks,
    getCertificates
} from "../../services/dashboard/AdminDashboard/index.js";

// export const studentDashboard = asyncHandler(async (req, res) => {
//     const userId = req.user._id;
//     console.log("userId", userId);
//     const [
//         user,
//         stats,
//         attendance,
//         analytics,
//         internships,
//         courses,
//         allInternships,
//         allCourses,
//         recommendedInternships,
//         suggestedUsers,
//         badges
//     ] = await Promise.all([
//         getUserInfo(userId),
//         getStudentStats(userId),
//         getStudentAttendance(userId),
//         getWeeklyAnalytics(userId),
//         getMyInternships(userId),
//         getMyCourses(userId),
//         getAllInternships(userId),
//         getAllCourses(userId),
//         getRecommendedInternships(userId),
//         getSuggestedUsers(userId),
//         getBadges(userId)
//     ]);

//     return res.status(200).json({
//         success: true,
//         dashboard: {
//             user,
//             stats,
//             attendance,
//             analytics,
//             internships,
//             courses,
//             allInternships,
//             allCourses,
//             recommendedInternships,
//             suggestedUsers,
//             badges
//         }
//     });

// });


export const studentDashboard = asyncHandler(async (req, res) => {

    const userId = req.user._id;

    console.log("=================================");
    console.log("STUDENT DASHBOARD");
    console.log("userId:", userId);
    console.log("=================================");

    try {

        console.log("1. getUserInfo");
        const user = await getUserInfo(userId);
        console.log("1. getUserInfo SUCCESS");

        console.log("2. getStudentStats");
        const stats = await getStudentStats(userId);
        console.log("2. getStudentStats SUCCESS");

        console.log("3. getStudentAttendance");
        const attendance = await getStudentAttendance(userId);
        console.log("3. getStudentAttendance SUCCESS");

        console.log("4. getWeeklyAnalytics");
        const analytics = await getWeeklyAnalytics(userId);
        console.log("4. getWeeklyAnalytics SUCCESS");

        console.log("5. getMyInternships");
        const internships = await getMyInternships(userId);
        console.log(
            "5. getMyInternships SUCCESS:",
            internships.length
        );

        console.log("6. getMyCourses");
        const courses = await getMyCourses(userId);
        console.log(
            "6. getMyCourses SUCCESS:",
            courses.length
        );
        console.log("COURSES:", courses);

        console.log("7. getAllInternships");
        const allInternships = await getAllInternships(userId);
        console.log(
            "7. getAllInternships SUCCESS:",
            allInternships.length
        );

        console.log("8. getAllCourses");
        const allCourses = await getAllCourses(userId);
        console.log(
            "8. getAllCourses SUCCESS:",
            allCourses.length
        );

        console.log("9. getRecommendedInternships");
        const recommendedInternships =
            await getRecommendedInternships(userId);
        console.log("9. getRecommendedInternships SUCCESS");

        console.log("10. getSuggestedUsers");
        const suggestedUsers =
            await getSuggestedUsers(userId);
        console.log("10. getSuggestedUsers SUCCESS");

        console.log("11. getBadges");
        const badges = await getBadges(userId);
        console.log("11. getBadges SUCCESS");

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

    } catch (error) {

        console.error("=================================");
        console.error("STUDENT DASHBOARD ERROR");
        console.error("=================================");

        console.error("Name:", error.name);
        console.error("Message:", error.message);
        console.error("Stack:", error.stack);

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }

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

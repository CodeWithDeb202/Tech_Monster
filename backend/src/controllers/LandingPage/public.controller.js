import User from "../../models/User.js";
import Internship from "../../models/Internship.js";
import asyncHandler from "../../utils/asyncHandler.js";

export const getHeroStats = asyncHandler(async (req, res) => {

    const [
        totalStudents,
        totalAdmins,
        totalInternships
    ] = await Promise.all([

        User.countDocuments({
            role: "student",
            isBlocked: false
        }),

        User.countDocuments({
            role: "admin",
            isBlocked: false
        }),

        Internship.countDocuments({
            isPublished: true
        })

    ]);

    return res.status(200).json({

        success: true,

        stats: {
            students: totalStudents,
            internships: totalInternships,
            admins: totalAdmins
        }

    });

});
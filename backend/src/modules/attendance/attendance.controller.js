import Attendance from "./models/Attendance.js";

import asyncHandler from "../../utils/asyncHandler.js";
import AppError from "../../utils/AppError.js";
import logActivity from "../../utils/logActivity.js";

export const checkIn = asyncHandler(async (req, res) => {

    const { internship } = req.body;

    if (!internship) {

        throw new AppError(

            "Internship is required",

            400

        );

    }

    const today = new Date();

    today.setHours(0, 0, 0, 0);

    const alreadyCheckedIn = await Attendance.findOne({

        student: req.user._id,

        internship,

        createdAt: {

            $gte: today

        }

    });

    if (alreadyCheckedIn) {

        throw new AppError(

            "Already checked in today",

            400

        );

    }

    const attendance = await Attendance.create({

        student: req.user._id,

        internship,

        checkIn: new Date()

    });

    await logActivity(

        req,

        req.user._id,

        "CHECK_IN",

        "Attendance",

        "Checked in successfully"

    );

    return res.status(201).json({

        success: true,

        message: "Check-in successful",

        attendance

    });

});

export const checkOut = asyncHandler(async (req, res) => {

    const attendance = await Attendance.findById(

        req.params.id

    );

    if (!attendance) {

        throw new AppError(

            "Attendance not found",

            404

        );

    }

    if (

        attendance.student.toString() !==

        req.user._id.toString()

    ) {

        throw new AppError(

            "Unauthorized",

            403

        );

    }

    if (attendance.checkOut) {

        throw new AppError(

            "Already checked out",

            400

        );

    }

    attendance.checkOut = new Date();

    const workedMilliseconds = attendance.checkOut - attendance.checkIn;

    const workedMinutes = Math.floor(workedMilliseconds / (1000 * 60));

    attendance.workingMinutes = workedMinutes;

    attendance.workingHours = Number((workedMinutes / 60).toFixed(2));



    await attendance.save();

    await logActivity(

        req,

        req.user._id,

        "CHECK_OUT",

        "Attendance",

        "Checked out successfully"

    );

    return res.status(200).json({

        success: true,

        message: "Check-out successful",

        attendance

    });

});

export const getMyAttendance = asyncHandler(async (req, res) => {

    const attendance = await Attendance.find({

        student: req.user._id

    })

        .populate(

            "internship",

            "title"

        )

        .sort({

            createdAt: -1

        });

    return res.status(200).json({

        success: true,

        attendance

    });

});

export const getInternAttendance = asyncHandler(async (req, res) => {

    const attendance = await Attendance.find({

        internship: req.params.id

    })

        .populate(

            "student",

            "firstName lastName email profileImage"

        )

        .sort({

            createdAt: -1

        });

    return res.status(200).json({

        success: true,

        attendance

    });

});
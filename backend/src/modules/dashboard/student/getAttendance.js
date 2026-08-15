import Attendance from "../../attendance/models/Attendance.js";

const getAttendance = async (userId) => {

    const attendance = await Attendance.find({

        student: userId

    }).sort({

        createdAt: -1

    });

    // ==========================
    // Attendance Summary
    // ==========================

    const totalDays = attendance.length;

    const presentDays = attendance.filter(

        item => item.status === "Present"

    ).length;

    const absentDays = attendance.filter(

        item => item.status === "Absent"

    ).length;

    const leaveDays = attendance.filter(

        item => item.status === "Leave"

    ).length;

    const attendancePercentage =

        totalDays === 0

            ? 0

            : Math.round(

                (presentDays / totalDays) * 100

            );

    // ==========================
    // Working Hours
    // ==========================

    const totalHours = attendance.reduce(

        (sum, item) => sum + (item.workingHours || 0),

        0

    );

    const totalMinutes = attendance.reduce(

        (sum, item) => sum + (item.workingMinutes || 0),

        0

    );

    const averageHours =

        totalDays === 0

            ? 0

            : Number(

                (totalHours / totalDays).toFixed(1)

            );

    // ==========================
    // Recent Attendance
    // ==========================

    const recentAttendance = attendance.slice(0, 10).map(item => ({

        _id: item._id,

        date: item.createdAt,

        status: item.status,

        checkIn: item.checkIn,

        checkOut: item.checkOut,

        workingHours: item.workingHours,

        workingMinutes: item.workingMinutes,

        internship: item.internship

    }));

    return {

        summary: {

            totalDays,

            presentDays,

            absentDays,

            leaveDays,

            attendancePercentage,

            totalHours,

            totalMinutes,

            averageHours

        },

        recentAttendance

    };

};

export default getAttendance;
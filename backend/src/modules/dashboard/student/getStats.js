import Task from "../../tasks/models/Task.js";
import Attendance from "../../attendance/models/Attendance.js";
import StudentInternship from "../../internships/models/StudentInternship.js";
import UserBadge from "../../profile/models/UserBadge.js";

const getStats = async (userId) => {

    const [

        internships,

        tasks,

        attendance,

        badges

    ] = await Promise.all([

        StudentInternship.find({

            student: userId

        }),

        Task.find({

            assignedTo: userId

        }),

        Attendance.find({

            student: userId

        }),

        UserBadge.find({

            user: userId

        })

    ]);

    // ==========================
    // Internship Analytics
    // ==========================

    const totalInternships = internships.length;

    const completedInternships = internships.filter(

        internship => internship.status === "Completed"

    ).length;

    const internshipProgress =

        totalInternships === 0

            ? 0

            : Math.round(

                (completedInternships / totalInternships) * 100

            );

    // ==========================
    // Task Analytics
    // ==========================

    const totalTasks = tasks.length;

    const approvedTasks = tasks.filter(

        task => task.status === "Approved"

    ).length;

    const submittedTasks = tasks.filter(

        task => task.status === "Submitted"

    ).length;

    const incorrectTasks = tasks.filter(

        task => task.status === "Incorrect"

    ).length;

    const pendingTasks = tasks.filter(

        task => task.status === "Pending"

    ).length;

    const taskProgress =

        totalTasks === 0

            ? 0

            : Math.round(

                (approvedTasks / totalTasks) * 100

            );

    // ==========================
    // Attendance Analytics
    // ==========================

    const totalAttendance = attendance.length;

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

        totalAttendance === 0

            ? 0

            : Math.round(

                (presentDays / totalAttendance) * 100

            );

    // ==========================
    // Learning Hours
    // ==========================

    const totalLearningHours = attendance.reduce(

        (sum, item) => sum + item.workingHours,

        0

    );

    return {

        internships: {

            total: totalInternships,

            completed: completedInternships,

            progress: internshipProgress

        },

        tasks: {

            total: totalTasks,

            approved: approvedTasks,

            submitted: submittedTasks,

            incorrect: incorrectTasks,

            pending: pendingTasks,

            progress: taskProgress

        },

        attendance: {

            total: totalAttendance,

            present: presentDays,

            absent: absentDays,

            leave: leaveDays,

            percentage: attendancePercentage

        },

        learning: {

            totalHours: totalLearningHours

        },

        badges: badges.length

    };

};

export default getStats;
import Attendance from "../../../models/Attendance.js";
import Task from "../../../models/task/Task.js";
import StudentInternship from "../../../models/shared/StudentInternship.js";

const days = [

    "Sun",
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat"

];

const getWeeklyAnalytics = async (userId) => {

    const [

        attendance,

        tasks,

        internships

    ] = await Promise.all([

        Attendance.find({

            student: userId

        }),

        Task.find({

            assignedTo: userId

        }),

        StudentInternship.find({

            student: userId

        })

    ]);

    // ==========================================
    // Weekly Attendance
    // ==========================================

    const attendanceData = new Array(7).fill(0);

    attendance.forEach(item => {

        const day = new Date(item.createdAt).getDay();

        attendanceData[day]++;

    });

    // ==========================================
    // Weekly Learning Hours
    // ==========================================

    const learningHours = new Array(7).fill(0);

    attendance.forEach(item => {

        const day = new Date(item.createdAt).getDay();

        learningHours[day] += item.workingHours || 0;

    });

    // ==========================================
    // Weekly Completed Tasks
    // ==========================================

    const completedTasks = new Array(7).fill(0);

    tasks

        .filter(task => task.status === "Completed")

        .forEach(task => {

            const day = new Date(task.updatedAt).getDay();

            completedTasks[day]++;

        });

    // ==========================================
    // Internship Progress
    // ==========================================

    const internshipProgress = internships.map(item => ({

        internship: item.internship,

        progress: item.progress,

        status: item.status

    }));

    // ==========================================
    // Return
    // ==========================================

    return {

        labels: days,

        attendance: attendanceData,

        learningHours,

        completedTasks,

        internshipProgress

    };

};

export default getWeeklyAnalytics;
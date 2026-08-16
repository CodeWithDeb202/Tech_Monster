import './Attendance.css';

import { useState, useEffect } from 'react';
import { getMyAttendance, checkIn, checkOut } from "../../../services/api/attendance.service";
import api from "../../../services/api/axios";
import { API } from "../../../services/api/endpoints";
import { toast } from "react-toastify";

import AttendanceHeader from './components/AttendanceHeader';
import StreakBadges from './components/StreakBadges';
import CalendarGrid from './components/CalendarGrid';

export default function AttendancePage() {
  const [attendanceData, setAttendanceData] = useState({});
  const [presentCount, setPresentCount] = useState(0);
  const [absentCount, setAbsentCount] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [dashboard, setDashboard] = useState(null);
  const [todayAttendance, setTodayAttendance] = useState(null);

  const loadAttendance = async () => {

    try {

      const { res } = await getMyAttendance();

      const records = res.attendance || [];

      const map = {};

      let present = 0;
      let absent = 0;
      let streak = 0;

      records.forEach(item => {

        const day = new Date(item.createdAt).getDate();

        if (item.checkIn) {

          map[day] = "present";
          present++;

        } else {

          map[day] = "absent";
          absent++;

        }

      });

      records.forEach(item => {

        if (item.checkIn) {

          streak++;

        } else {

          streak = 0;

        }

      });

      const today = new Date().toDateString();

      const todayRecord = records.find(
        item =>
          new Date(item.createdAt).toDateString() === today
      );

      setTodayAttendance(todayRecord || null);

      setAttendanceData(map);
      setPresentCount(present);
      setAbsentCount(absent);
      setCurrentStreak(streak);

    } catch (err) {

      console.log(err);

    }

  };

  const loadDashboard = async () => {

    try {

      const { data } = await api.get(API.DASHBOARD.STUDENT);

      setDashboard(data.dashboard);

    } catch (err) {

      console.log(err);

    }

  };

  useEffect(() => {

    loadDashboard();

    loadAttendance();

  }, []);

  const handleCheckIn = async () => {

    try {

      await checkIn({

        internship: todayAttendance?.internship?._id

      });

      toast.success("Checked In Successfully");

      loadAttendance();

    } catch (err) {

      toast.error(
        err.response?.data?.message || "Check-In Failed"
      );

    }

  };

  const handleCheckOut = async () => {

    try {

      await checkOut(todayAttendance._id);

      toast.success("Checked Out Successfully");

      loadAttendance();

    } catch (err) {

      toast.error(
        err.response?.data?.message || "Check-Out Failed"
      );

    }

  };

  return (
    <div className="attendance-page">
      <AttendanceHeader
        user={dashboard?.user}
        presentCount={presentCount}
        absentCount={absentCount}
      />

      <div className="attendanceActions">

        {
          !todayAttendance ? (

            <button onClick={handleCheckIn}>
              Check In
            </button>

          ) : !todayAttendance.checkOut ? (

            <button onClick={handleCheckOut}>
              Check Out
            </button>

          ) : (

            <button disabled>
              Attendance Completed
            </button>

          )
        }

      </div>


      <StreakBadges currentStreak={currentStreak} />
      <CalendarGrid attendanceData={attendanceData} />
    </div>
  );
}
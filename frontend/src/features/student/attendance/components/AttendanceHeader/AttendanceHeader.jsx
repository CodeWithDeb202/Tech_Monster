import { motion } from 'framer-motion';
import './AttendanceHeader.css';

export default function AttendanceHeader({ user, presentCount, absentCount }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="attendance-title">Attendance</h2>

      <div className="user-info-container">
        <div className="user-profile-left">
          <img
            src={
              user?.avatar ||
              "https://ui-avatars.com/api/?name=Student"
            }
            alt="Profile"
            className="user-avatar"
          />

          <h3>
            {user?.firstName} {user?.lastName}
          </h3>

          <p>
            {user?.email}
          </p>
        </div>
      </div>

      <div className="attendance-stats-right">
        <div className="stat-box present">
          <span className="label">Present Days</span>
          <span className="value">{presentCount}</span>
        </div>
        <div className="stat-box absent">
          <span className="label">Absent Days</span>
          <span className="value">{absentCount}</span>
        </div>
      </div>
    </motion.div >
  );
}
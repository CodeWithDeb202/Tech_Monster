import { motion } from 'framer-motion';
import './CalendarGrid.css';

export default function CalendarGrid({ attendanceData }) {
  const dateObj = new Date();
  const today = new Date().getDate();
  const currentMonthName = dateObj.toLocaleString('default', { month: 'long', year: 'numeric' });

  const daysInMonth = new Date(dateObj.getFullYear(), dateObj.getMonth() + 1, 0).getDate();
  const firstDayIndex = new Date(dateObj.getFullYear(), dateObj.getMonth(), 1).getDay();

  const daysArray = [];

  for (let i = 0; i < firstDayIndex; i++) {
    daysArray.push({ type: 'empty' });
  }

  for (let day = 1; day <= daysInMonth; day++) {

    let status = attendanceData[day];

    if (!status) {

      status = day < today ? "absent" : "pending";

    }
    daysArray.push({ type: 'day', day, status });
  }

  return (
    <motion.div
      className="calendar-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <div className="calendar-header">
        <h3>{currentMonthName}</h3>
      </div>

      <div className="weekdays-grid">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d, i) => (
          <div key={i}>{d}</div>
        ))}
      </div>

      <div className="days-grid">
        {daysArray.map((item, index) => {
          if (item.type === 'empty') {
            return <div key={index} className="day-cell empty" />;
          }

          let statusClass = "";

          if (item.status === "present") {

            statusClass = "present";

          }
          else if (item.status === "absent") {

            statusClass = "absent";

          }
          else if (item.day === today) {

            statusClass = "today";

          }
          return (
            <motion.div
              key={index}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              className={`day-cell ${statusClass}`}
            >
              <span>{item.day}</span>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
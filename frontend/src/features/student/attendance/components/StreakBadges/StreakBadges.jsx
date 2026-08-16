import { motion } from 'framer-motion';
import { FaTrophy } from 'react-icons/fa';
import './StreakBadges.css';

export default function StreakBadges({ currentStreak }) {
  const milestoneBadges = [
    { days: 7, label: '7 Days Streak' },
    { days: 9, label: '9 Days Streak' },
    { days: 15, label: '15 Days Streak' },
    { days: 30, label: '30/31 Days Streak' },
  ];

  return (
    <motion.div 
      className="streak-section"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <h4>Achievement Badges</h4>
      <div className="badges-container">
        {milestoneBadges.map((badge, index) => {
          const isUnlocked = currentStreak >= badge.days;
          return (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              className={`badge-card ${isUnlocked ? 'unlocked' : 'locked'}`}
            >
              <FaTrophy color={isUnlocked ? '#00f0ff' : '#8a9bb8'} />
              <span>{badge.label}</span>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
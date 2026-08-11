import "./LearningStreak.css";

import { motion } from "framer-motion";

import {
  HiFire,
  HiBolt,
  HiArrowTrendingUp,
} from "react-icons/hi2";

const LearningStreak = ({ streak }) => {

  return (

    <motion.section
      id="learning-streak"
      initial={{ opacity:0,y:80 }}
      whileInView={{ opacity:1,y:0 }}
      viewport={{ once:true }}
      transition={{ duration:.8 }}
    >
      <div id="streak-glow"></div>

      <div id="streak-left">
        <motion.div
          animate={{
            rotate:[0,8,-8,0],
            scale:[1,1.05,1]
          }}
          transition={{
            repeat:Infinity,
            duration:3
          }}
          id="fire-icon"

        >
          <HiFire/>
        </motion.div>

        <div>
          <h2>
            {streak?.days || 0} Day Streak 🔥
          </h2>

          <p>
            Keep learning every day to maintain your streak.
          </p>
        </div>
      </div>

      <div id="streak-right">
        <div id="streak-progress">
          <motion.div
            id="streak-fill"
            initial={{ width:0 }}
            whileInView={{
              width:`${streak?.progress || 0}%`
            }}
            transition={{
              duration:2
            }}
          />
        </div>

        <div id="streak-footer">
          <span>
            <HiBolt/>
            Weekly Goal
          </span>

          <strong>
            {streak?.progress || 0}%
          </strong>
        </div>

        <motion.button
          whileHover={{
            scale:1.05,
            y:-4
          }}
          whileTap={{
            scale:.95
          }}
          id="continue-streak-btn"
        >

          <HiArrowTrendingUp/>

          Continue Streak

        </motion.button>

      </div>
    </motion.section>

  );

};

export default LearningStreak;
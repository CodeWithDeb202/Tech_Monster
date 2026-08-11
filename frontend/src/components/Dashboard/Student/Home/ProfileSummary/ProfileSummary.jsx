import "./ProfileSummary.css";
import { motion } from "framer-motion";
import {
  HiCheckBadge,
  HiEnvelope,
  HiUserCircle,
} from "react-icons/hi2";
import { useNavigate } from "react-router-dom";

import defaultProfileImage from '../../../../../assets/profile/default-profile.svg';

import useAuth from "../../../../../hooks/useAuth";

const ProfileSummary = ({ username }) => {
  const navigate = useNavigate();
  const {user} = useAuth();


  const skills = username?.skills || [];
  const progress = username?.profileCompletion || 0;

  return (
    <motion.section
      id="profile-summary"
      initial={{ opacity: 0, y: 80 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{once: true, amount: 0.3}}
      transition={{duration: 0.7 }}
    >
      {/* Glow */}

      <div className="profile-glow profile-glow-1"></div>
      <div className="profile-glow profile-glow-2"></div>

      {/* LEFT */}

      <div id="profile-left">

        <motion.div
          whileHover={{
            rotate: 3,
            scale: 1.05,
          }}
          id="profile-image"
        >
          <img
            src={
              username?.avatar || defaultProfileImage
            }
            alt={username?.fullName}
          />
        </motion.div>

        <div id="profile-info">

          <h2>{
              username?.fullName?.trim() ? username?.fullName : user?.username?.charAt(0).toUpperCase() + user?.username?.slice(1)
            }
          </h2>

          <p>

            <HiEnvelope />

            {username?.email}

          </p>

          <div id="skills-wrapper">

            {skills.map((skill, index) => (
              <motion.span
                key={index}
                id="skill-chip"
                initial={{
                  opacity: 0,
                  scale: .8,
                }}
                whileInView={{
                  opacity: 1,
                  scale: 1,
                }}
                transition={{
                  delay: index * .08,
                }}
              >
                {skill}
              </motion.span>
            ))}

          </div>

        </div>

      </div>

      {/* Divider */}

      <motion.div
        id="profile-divider"
        initial={{ scaleY: 0 }}
        whileInView={{ scaleY: 1 }}
        transition={{ duration: .7 }}
      />

      {/* Right */}

      <div id="profile-right">

        <div id="progress-title">

          <HiCheckBadge />

          <span>Profile Completion</span>

        </div>

        <div id="progress-bar">

          <motion.div
            id="progress-fill"
            initial={{
              width: 0,
            }}
            whileInView={{
              width: `${progress}%`,
            }}
            transition={{
              duration: 1.5,
            }}
          />

        </div>

        <h1>{progress}%</h1>

        <p>
          Complete your remaining profile
          details to unlock all platform
          features.
        </p>

        <motion.button
          whileHover={{
            scale: 1.05,
            y: -3,
          }}
          whileTap={{
            scale: .95,
          }}
          id="complete-btn"
          onClick={() => navigate("/student/account")}
        >
          <HiUserCircle />
          {progress === 100 ? "Completed" : "Complete Profile"}
        </motion.button>

      </div>

    </motion.section>
  );
};

export default ProfileSummary;
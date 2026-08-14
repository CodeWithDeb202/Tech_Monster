import { motion } from 'framer-motion';

import defaultProfileImg from '../../../../assets/profile/default-profile.svg';

export default function ProfileHeader({ user, followersCount, followingCount }) {
  const fullName = `${user?.firstName || ''} ${user?.middleName || ''} ${user?.lastName || ''}`.trim() || user?.username;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="profile-card-glass header-card"
    >
      <div className="avatar-wrapper">
        <img
          src={
            user?.avatar?.startsWith("http")
              ? user.avatar
              : defaultProfileImg
          }
          alt={user?.username}
          className="avatar-img"
        />
        <span className="live-status-dot"></span>
      </div>

      <div className="header-details">
        <h2 className="user-fullname">{fullName}</h2>
        <p className="user-username">@{user?.username}</p>
        <p className="user-bio">
          {user?.bio || "No bio available"}
        </p>

        <div className="stats-group">
          <div className="stat-box">
            <span className="stat-num">{followersCount}</span>
            <span className="stat-label">Followers</span>
          </div>
          <div className="stat-divider" />
          <div className="stat-box">
            <span className="stat-num">{followingCount}</span>
            <span className="stat-label">Following</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
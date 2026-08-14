import { useEffect, useState } from "react";

import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification
} from "../../../../services/api/notification.service";
import { motion } from 'framer-motion';
import './Notification.css';

import { socket } from "../../../../socket/socket";

export default function Notification() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadNotifications = async () => {

    try {

      const res = await getNotifications();

      setNotifications(res.notifications || []);

    } catch (err) {

      console.log(err);

    } finally {

      setLoading(false);

    }

  };

  useEffect(() => {

    loadNotifications();

  }, []);

  useEffect(() => {

    loadNotifications();

    const handleNewNotification = (notification) => {

      setNotifications((prev) => [
        notification,
        ...prev
      ]);

    };

    socket.on(
      "newNotification",
      handleNewNotification
    );

    return () => {

      socket.off(
        "newNotification",
        handleNewNotification
      );

    };

  }, []);

  const handleRead = async (id) => {

    try {

      await markNotificationRead(id);

      loadNotifications();

    } catch (err) {

      console.log(err);

    }

  };

  const handleReadAll = async () => {

    try {

      await markAllNotificationsRead();

      loadNotifications();

    } catch (err) {

      console.log(err);

    }

  };

  const handleDelete = async (id) => {

    try {

      await deleteNotification(id);

      loadNotifications();

    } catch (err) {

      console.log(err);

    }

  };

  return (
    <div className="notification-page-wrapper">
      <div className="notification-page-header">
        <h2 className="notification-main-title">Notifications</h2>
        <button className="mark-all-btn" onClick={handleReadAll}>Mark all as read</button>
      </div>

      <div className="notifications-container">
        {notifications.map((item, index) => (
          <motion.div
            key={item._id}
            className={`notification-card ${!item.isRead ? "unread" : ""}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            whileHover={{ scale: 1.01 }}
            onClick={() => handleRead(item._id)}
          >
            <div className="notif-content">
              <h4>{item.title}</h4>
              <p>{item.message}</p>

              <span className="notif-time">
                {new Date(item.createdAt).toLocaleString()}
              </span>
            </div>

            <div className={`read-status-dot ${item.isRead ? "read" : ""}`} />

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(item._id);
              }}
            >
              Delete
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
import {
    useCallback,
    useEffect,
    useState
} from "react";

import NotificationContext from "./NotificationContext";

import {
    getNotifications,
    markNotificationRead,
    markAllNotificationsRead,
    deleteNotification
} from "../../../services/api/notification.service";

import { socket } from "../../../services/socket/socket";

import useAuth from "../../../shared/hooks/useAuth";

import { toast } from "react-toastify";


function NotificationProvider({ children }) {

    const { user, token } = useAuth();

    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(false);


    // ==========================================
    // LOAD NOTIFICATIONS
    // ==========================================

    const loadNotifications = useCallback(async () => {

        if (!user?._id || !token) {
            setNotifications([]);
            return;
        }

        try {

            setLoading(true);

            const res = await getNotifications();

            setNotifications(
                res.notifications || []
            );

        } catch (error) {

            console.error(
                "Failed to load notifications:",
                error
            );

        } finally {

            setLoading(false);

        }

    }, [user?._id, token]);


    // ==========================================
    // INITIAL LOAD
    // ==========================================

    useEffect(() => {

        loadNotifications();

    }, [loadNotifications]);


    // ==========================================
    // LIVE SOCKET NOTIFICATION
    // ==========================================

    useEffect(() => {

        if (!user?._id || !token) {
            return;
        }


        const handleNewNotification = (
            notification
        ) => {

            console.log(
                "🔔 New notification:",
                notification
            );


            // Add notification at top
            setNotifications((prev) => [

                notification,

                ...prev.filter(
                    item =>
                        item._id !== notification._id
                )

            ]);


            // Live popup
            toast.info(

                <div>
                    <strong>
                        {notification.title}
                    </strong>

                    <div style={{
                        marginTop: "4px"
                    }}>
                        {notification.message}
                    </div>
                </div>

            );

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

    }, [user?._id, token]);


    // ==========================================
    // MARK SINGLE AS READ
    // ==========================================

    const markAsRead = async (id) => {

        try {

            const res =
                await markNotificationRead(id);


            setNotifications((prev) =>

                prev.map((notification) =>

                    notification._id === id

                        ? {
                            ...notification,
                            isRead: true
                        }

                        : notification

                )

            );


            return res;

        } catch (error) {

            console.error(
                "Failed to mark notification as read:",
                error
            );

            throw error;

        }

    };


    // ==========================================
    // MARK ALL AS READ
    // ==========================================

    const markAllAsRead = async () => {

        try {

            const res =
                await markAllNotificationsRead();


            setNotifications((prev) =>

                prev.map((notification) => ({
                    ...notification,
                    isRead: true
                }))

            );


            return res;

        } catch (error) {

            console.error(
                "Failed to mark all notifications:",
                error
            );

            throw error;

        }

    };


    // ==========================================
    // DELETE
    // ==========================================

    const removeNotification = async (id) => {

        try {

            await deleteNotification(id);


            setNotifications((prev) =>

                prev.filter(
                    notification =>
                        notification._id !== id
                )

            );

        } catch (error) {

            console.error(
                "Failed to delete notification:",
                error
            );

            throw error;

        }

    };


    // ==========================================
    // UNREAD COUNT
    // ==========================================

    const unreadCount =
        notifications.filter(
            notification =>
                !notification.isRead
        ).length;


    return (

        <NotificationContext.Provider
            value={{

                notifications,

                loading,

                unreadCount,

                loadNotifications,

                markAsRead,

                markAllAsRead,

                removeNotification

            }}
        >

            {children}

        </NotificationContext.Provider>

    );

}


export default NotificationProvider;
import { useContext } from "react";

import NotificationContext
    from "../context/Notification/NotificationContext";


export default function useNotification() {

    const context =
        useContext(NotificationContext);


    if (!context) {

        throw new Error(
            "useNotification must be used inside NotificationProvider"
        );

    }


    return context;

}
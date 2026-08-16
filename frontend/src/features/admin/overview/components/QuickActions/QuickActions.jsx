import "./QuickActions.css";

import { useNavigate } from "react-router-dom";
import {
    HiPlusCircle,
    HiUsers,
    HiClipboardList,
    HiBadgeCheck,
    HiBell,
    HiCog
} from "react-icons/hi";

export default function QuickActions() {

    const navigate = useNavigate();

    const adminActions = [

        {
            icon: <HiPlusCircle />,
            title: "Create Internship",
            path: "/admin/internships/create"
        },

        {
            icon: <HiUsers />,
            title: "Manage Students",
            path: "/admin/students"
        },

        {
            icon: <HiClipboardList />,
            title: "Manage Tasks",
            path: "/admin/tasks"
        },

        {
            icon: <HiBadgeCheck />,
            title: "Certificates",
            path: "/admin/certificates"
        },

        {
            icon: <HiBell />,
            title: "Notifications",
            path: "/admin/notifications"
        },

        {
            icon: <HiCog />,
            title: "Settings",
            path: "/admin/settings"
        }

    ];

    return (

        <div className="quickActions">

            <h2>

                Quick Actions

            </h2>

            <div className="quickGrid">

                {

                    adminActions.map((action, index) => (

                        <button

                            key={index}

                            className="quickButton"

                            onClick={() => navigate(action.path)}

                        >

                            {action.icon}

                            <span>

                                {action.title}

                            </span>

                        </button>

                    ))

                }

            </div>

        </div>

    );

}
import "./StatsCards.css";

import {
    HiUserGroup,
    HiFolder,
    HiFire,
    HiBadgeCheck,
    HiClipboardList,
    HiCalendar
} from "react-icons/hi";

export default function StatsCards({ stats }) {

    const cards = [
        {
            icon: <HiUserGroup />,
            title: "Total Students",
            value: stats.totalStudents
        },
        {
            icon: <HiFolder />,
            title: "Active Internships",
            value: stats.activeInternships
        },
        {
            icon: <HiFire />,
            title: "Pending Review",
            value: stats.submittedTasks
        },
        {
            icon: <HiBadgeCheck />,
            title: "Approved Tasks",
            value: stats.approvedTasks
        },
        {
            icon: <HiClipboardList />,
            title: "Incorrect Tasks",
            value: stats.incorrectTasks
        },
        {
            icon: <HiCalendar />,
            title: "Certificates",
            value: stats.totalCertificates
        }
    ];

    return (

        <div id="adminStatsCards">
            {
                cards.map((card, index) => (
                    <div
                        id="adminStatsCard"
                        key={index}
                    >
                        <div id="adminStasCardIcon">
                            {card.icon}
                        </div>
                        <div id="adminStasCardInfo">
                            <h4>
                                {card.title}
                            </h4>
                            <h2>
                                {card.value}
                            </h2>
                        </div>
                    </div>
                ))
            }
        </div>
    );

}
import { useEffect, useState } from "react";

import "./ServerStatus.css";

import {
    HiServer,
    HiDatabase,
    HiCloud,
    HiClock
} from "react-icons/hi";

import { getServerStatus } from "../../../../../services/server/server.service.js";

export default function ServerStatus() {

    const [status, setStatus] = useState(null);

    useEffect(() => {

        // eslint-disable-next-line react-hooks/immutability
        loadStatus();

    }, []);

    const loadStatus = async () => {

        try {

            const data = await getServerStatus();

            setStatus(data);

        } catch (error) {

            console.log(error);

        }

    };

    if (!status) {

        return <p>Loading...</p>;

    }

    const server = [

        {
            icon: <HiServer />,
            title: "Backend API",
            value: status.backend
        },

        {
            icon: <HiDatabase />,
            title: "MongoDB",
            value: status.database
        },

        {
            icon: <HiCloud />,
            title: "Cloudinary",
            value: status.cloudinary
        },

        {
            icon: <HiClock />,
            title: "Server Time",
            value: new Date(status.serverTime).toLocaleTimeString()
        }

    ];

    return (

        <div className="serverStatus">

            <h2>Server Status</h2>

            {

                server.map((item, index) => (

                    <div
                        className="statusItem"
                        key={index}
                    >

                        <div className="statusLeft">

                            {item.icon}

                            <span>{item.title}</span>

                        </div>

                        <div className="statusRight">

                            {

                                item.title !== "Server Time" &&

                                <span className="dot"></span>

                            }

                            <small>{item.value}</small>

                        </div>

                    </div>

                ))

            }

        </div>

    );

}
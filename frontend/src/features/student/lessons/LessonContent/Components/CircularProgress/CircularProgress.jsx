import "./CircularProgress.css";

import { motion } from "framer-motion";

export default function CircularProgress({
    value = 0
}) {
    // Clamp value between 0 and 100 so the ring never over/underflows.
    const percent = Math.min(100, Math.max(0, Math.round(value || 0)));

    const radius = 25;
    const stroke = 5;

    const normalizedRadius = radius - stroke * 0.5;

    const circumference = normalizedRadius * 2 * Math.PI;

    const strokeDashoffset =
        circumference - (percent / 100) * circumference;

    return (

        <motion.div
            id="circle-progress"
            initial={{
                opacity: 0,
                scale: .8
            }}
            animate={{
                opacity: 1,
                scale: 1
            }}
            transition={{
                duration: .6
            }}
            title={`${percent}% read`}
        >

            <svg
                height={radius * 2}
                width={radius * 2}
            >

                <defs>

                    <linearGradient
                        id="circleGradient"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="100%"
                    >

                        <stop
                            offset="0%"
                            stopColor="#00d4ff"
                        />
                        <stop
                            offset="100%"
                            stopColor="#00ff95"
                        />
                    </linearGradient>
                </defs>

                <circle
                    id="circle-bg"
                    strokeWidth={stroke}
                    r={normalizedRadius}
                    cx={radius}
                    cy={radius}
                />

                <motion.circle
                    id="circle-bar"
                    stroke="url(#circleGradient)"
                    strokeWidth={stroke}
                    strokeLinecap="round"
                    fill="transparent"
                    r={normalizedRadius}
                    cx={radius}
                    cy={radius}
                    strokeDasharray={circumference}
                    initial={{
                        strokeDashoffset: circumference
                    }}
                    animate={{
                        strokeDashoffset
                    }}
                    transition={{
                        duration: .8,
                        ease: "easeOut"
                    }}
                />
            </svg>

            <div id="circle-content">
                <h2>
                    {percent}%
                </h2>
            </div>
        </motion.div>

    );

}

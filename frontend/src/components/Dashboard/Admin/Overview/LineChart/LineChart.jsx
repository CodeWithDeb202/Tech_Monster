import "./LineChart.css";

import {
    ResponsiveContainer,
    AreaChart,
    Area,
    CartesianGrid,
    Tooltip,
    XAxis,
    YAxis
} from "recharts";

export default function LineChart({ chartData = [] }) {

    return (

        <div id="adminChart">

            <div id="adminChartHeader">
                <h2>Weekly Attendance</h2>
            </div>

            <ResponsiveContainer
                width="100%"
                height={350}
            >

                <AreaChart
                    data={chartData}
                >
                    <defs>
                        <linearGradient
                            id="attendance"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                        >
                            <stop
                                offset="5%"
                                stopColor="#00ffff"
                                stopOpacity={0.8}
                            />

                            <stop
                                offset="95%"
                                stopColor="#00ffff"
                                stopOpacity={0}
                            />
                        </linearGradient>

                    </defs>

                    <CartesianGrid
                        stroke="#2b2b3f"
                    />

                    <XAxis
                        dataKey="day"
                        stroke="#cfcfcf"
                    />

                    <YAxis
                        stroke="#cfcfcf"
                    />

                    <Tooltip />

                    <Area
                        type="monotone"
                        dataKey="attendance"
                        stroke="#00ffff"
                        strokeWidth={3}
                        fill="url(#attendance)"
                    />
                </AreaChart>
            </ResponsiveContainer>

        </div>

    );

}
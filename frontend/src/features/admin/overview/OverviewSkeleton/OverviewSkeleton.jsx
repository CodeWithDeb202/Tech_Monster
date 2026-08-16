import Skeleton from "../../../dashboard/common/LoaderPage/Skeleton";
import "./OverviewSkeleton.css";

const OverviewSkeleton = () => {
    return (
        <div className="overview-skeleton">

            {/* Top Section */}
            <div className="overview-skeleton-top">

                {/* Welcome Card */}
                <div className="skeleton-card welcome-skeleton">
                    <Skeleton
                        width="180px"
                        height="24px"
                        radius="6px"
                    />

                    <Skeleton
                        width="280px"
                        height="18px"
                        radius="5px"
                    />

                    <Skeleton
                        width="150px"
                        height="40px"
                        radius="8px"
                    />
                </div>

                {/* Server Status */}
                <div className="skeleton-card server-skeleton">
                    <Skeleton
                        width="140px"
                        height="22px"
                    />

                    <Skeleton
                        width="100%"
                        height="14px"
                    />

                    <Skeleton
                        width="80%"
                        height="14px"
                    />

                    <Skeleton
                        width="120px"
                        height="35px"
                    />
                </div>

            </div>


            {/* Stats */}
            <div className="stats-skeleton">

                {[1, 2, 3, 4].map((item) => (
                    <div
                        className="skeleton-card stats-item"
                        key={item}
                    >
                        <Skeleton
                            width="50px"
                            height="50px"
                            radius="12px"
                        />

                        <div className="stats-content">
                            <Skeleton
                                width="90px"
                                height="14px"
                            />

                            <Skeleton
                                width="70px"
                                height="24px"
                            />
                        </div>
                    </div>
                ))}

            </div>


            {/* Chart + Attendance */}
            <div className="overview-skeleton-chart">

                <div className="skeleton-card chart-skeleton">

                    <Skeleton
                        width="150px"
                        height="22px"
                    />

                    <Skeleton
                        width="100%"
                        height="280px"
                        radius="10px"
                    />

                </div>


                <div className="skeleton-card attendance-skeleton">

                    <Skeleton
                        width="170px"
                        height="22px"
                    />

                    {[1, 2, 3, 4].map((item) => (
                        <div
                            className="attendance-row"
                            key={item}
                        >
                            <Skeleton
                                width="100px"
                                height="15px"
                            />

                            <Skeleton
                                width="60px"
                                height="15px"
                            />
                        </div>
                    ))}

                </div>

            </div>


            {/* Middle */}
            <div className="overview-skeleton-middle">

                <div className="skeleton-card large-list-skeleton">

                    <Skeleton
                        width="170px"
                        height="22px"
                    />

                    {[1, 2, 3, 4, 5].map((item) => (
                        <div
                            className="list-row"
                            key={item}
                        >
                            <Skeleton
                                width="42px"
                                height="42px"
                                radius="50%"
                            />

                            <div>
                                <Skeleton
                                    width="140px"
                                    height="14px"
                                />

                                <Skeleton
                                    width="90px"
                                    height="12px"
                                />
                            </div>
                        </div>
                    ))}

                </div>


                <div className="skeleton-card large-list-skeleton">

                    <Skeleton
                        width="160px"
                        height="22px"
                    />

                    {[1, 2, 3, 4, 5].map((item) => (
                        <div
                            className="list-row"
                            key={item}
                        >
                            <Skeleton
                                width="42px"
                                height="42px"
                                radius="50%"
                            />

                            <div>
                                <Skeleton
                                    width="150px"
                                    height="14px"
                                />

                                <Skeleton
                                    width="80px"
                                    height="12px"
                                />
                            </div>
                        </div>
                    ))}

                </div>

            </div>


            {/* Bottom */}
            <div className="overview-skeleton-bottom">

                <div className="skeleton-card bottom-skeleton">

                    <Skeleton
                        width="150px"
                        height="22px"
                    />

                    {[1, 2, 3, 4].map((item) => (
                        <div
                            className="list-row"
                            key={item}
                        >
                            <Skeleton
                                width="40px"
                                height="40px"
                                radius="8px"
                            />

                            <Skeleton
                                width="180px"
                                height="14px"
                            />
                        </div>
                    ))}

                </div>


                <div className="skeleton-card bottom-skeleton">

                    <Skeleton
                        width="130px"
                        height="22px"
                    />

                    {[1, 2, 3, 4].map((item) => (
                        <div
                            className="list-row"
                            key={item}
                        >
                            <Skeleton
                                width="40px"
                                height="40px"
                                radius="8px"
                            />

                            <Skeleton
                                width="170px"
                                height="14px"
                            />
                        </div>
                    ))}

                </div>

            </div>


            {/* Footer */}
            <div className="overview-skeleton-footer">

                <div className="skeleton-card footer-skeleton">
                    <Skeleton
                        width="180px"
                        height="22px"
                    />

                    <Skeleton
                        width="100%"
                        height="180px"
                    />
                </div>

                <div className="skeleton-card footer-skeleton">
                    <Skeleton
                        width="140px"
                        height="22px"
                    />

                    <Skeleton
                        width="100%"
                        height="180px"
                    />
                </div>

            </div>

        </div>
    );
};

export default OverviewSkeleton;
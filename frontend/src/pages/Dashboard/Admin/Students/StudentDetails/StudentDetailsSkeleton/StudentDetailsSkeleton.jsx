import "./StudentDetailsSkeleton.css";

import Skeleton from "../../../../../../components/Dashboard/common/LoaderPage/Skeleton";

export default function StudentDetailsSkeleton() {

    return (

        <div className="studentDetailsSkeleton">

            {/* ================= HERO ================= */}

            <div className="studentDetailsSkeletonHero">

                <Skeleton
                    width="130px"
                    height="130px"
                    borderRadius="50%"
                />

                <div className="studentDetailsSkeletonHeroInfo">

                    <Skeleton
                        width="220px"
                        height="28px"
                        borderRadius="6px"
                    />

                    <Skeleton
                        width="260px"
                        height="15px"
                    />

                    <Skeleton
                        width="180px"
                        height="15px"
                    />

                    <Skeleton
                        width="140px"
                        height="15px"
                    />

                </div>

            </div>


            {/* ================= PROFILE CARDS ================= */}

            <div className="studentDetailsSkeletonGrid">

                {/* Profile */}

                <div className="studentDetailsSkeletonCard">

                    <Skeleton
                        width="100px"
                        height="22px"
                    />

                    <div className="studentDetailsSkeletonCardContent">

                        <Skeleton height="15px" />

                        <Skeleton height="15px" />

                        <Skeleton height="15px" />

                        <Skeleton height="15px" />

                        <Skeleton height="15px" />

                        <Skeleton height="15px" />

                        <Skeleton
                            width="85%"
                            height="15px"
                        />

                    </div>

                </div>


                {/* Address */}

                <div className="studentDetailsSkeletonCard">

                    <Skeleton
                        width="100px"
                        height="22px"
                    />

                    <div className="studentDetailsSkeletonCardContent">

                        <Skeleton height="15px" />

                        <Skeleton height="15px" />

                        <Skeleton width="70%" height="15px" />

                        <Skeleton width="60%" height="15px" />

                        <Skeleton width="35%" height="15px" />

                    </div>

                </div>


                {/* Account */}

                <div className="studentDetailsSkeletonCard">

                    <Skeleton
                        width="100px"
                        height="22px"
                    />

                    <div className="studentDetailsSkeletonCardContent">

                        <Skeleton height="15px" />

                        <Skeleton height="15px" />

                        <Skeleton height="15px" />

                        <Skeleton width="45%" height="15px" />

                    </div>

                </div>


                {/* Social Links */}

                <div className="studentDetailsSkeletonCard">

                    <Skeleton
                        width="130px"
                        height="22px"
                    />

                    <div className="studentDetailsSkeletonCardContent">

                        <Skeleton height="15px" />

                        <Skeleton height="15px" />

                    </div>

                </div>

            </div>


            {/* ================= INTERNSHIPS ================= */}

            <SkeletonTable
                titleWidth="110px"
                columns={3}
            />


            {/* ================= ATTENDANCE ================= */}

            <SkeletonTable
                titleWidth="120px"
                columns={2}
            />


            {/* ================= TASKS ================= */}

            <SkeletonTable
                titleWidth="70px"
                columns={2}
            />


            {/* ================= NOTIFICATIONS ================= */}

            <SkeletonTable
                titleWidth="180px"
                columns={3}
            />

        </div>

    );

}


/* ================================================= */
/* TABLE SKELETON COMPONENT */
/* ================================================= */

function SkeletonTable({
    titleWidth = "120px",
    columns = 3
}) {

    return (

        <div className="studentDetailsSkeletonTable">

            <div className="studentDetailsSkeletonTableHeader">

                <Skeleton
                    width={titleWidth}
                    height="22px"
                />

            </div>


            <div className="studentDetailsSkeletonRows">

                {Array.from({ length: 4 }).map((_, rowIndex) => (

                    <div
                        className="studentDetailsSkeletonRow"
                        key={rowIndex}
                        style={{
                            gridTemplateColumns:
                                `repeat(${columns}, 1fr)`
                        }}
                    >

                        {Array.from({
                            length: columns
                        }).map((_, columnIndex) => (

                            <Skeleton
                                key={columnIndex}
                                width={
                                    columnIndex === 0
                                        ? "80%"
                                        : "60%"
                                }
                                height="15px"
                            />

                        ))}

                    </div>

                ))}

            </div>

        </div>

    );

}
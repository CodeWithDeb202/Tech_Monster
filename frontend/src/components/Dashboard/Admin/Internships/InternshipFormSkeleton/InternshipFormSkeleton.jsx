import Skeleton from "../../../common/LoaderPage/Skeleton";
import "./InternshipFormSkeleton.css";

export default function InternshipFormSkeleton() {

    return (

        <div className="internshipFormSkeleton">

            {/* Header */}

            <div className="internshipFormSkeletonHeader">

                <Skeleton
                    width="45px"
                    height="45px"
                    borderRadius="10px"
                />

                <Skeleton
                    width="250px"
                    height="28px"
                />

            </div>


            {/* Form */}

            <div className="internshipFormSkeletonForm">

                {/* Image */}

                <div className="internshipFormSkeletonGroup">

                    <Skeleton
                        width="190px"
                        height="15px"
                    />

                    <Skeleton
                        width="100%"
                        height="42px"
                    />

                    <Skeleton
                        width="200px"
                        height="120px"
                        borderRadius="15px"
                    />

                </div>


                {/* Title */}

                <div className="internshipFormSkeletonGroup">

                    <Skeleton
                        width="70px"
                        height="15px"
                    />

                    <Skeleton
                        width="100%"
                        height="42px"
                    />

                </div>


                {/* Description */}

                <div className="internshipFormSkeletonGroup">

                    <Skeleton
                        width="110px"
                        height="15px"
                    />

                    <Skeleton
                        width="100%"
                        height="42px"
                    />

                </div>


                {/* Duration */}

                <div className="internshipFormSkeletonGroup">

                    <Skeleton
                        width="90px"
                        height="15px"
                    />

                    <Skeleton
                        width="100%"
                        height="42px"
                    />

                </div>


                {/* Slug */}

                <div className="internshipFormSkeletonGroup">

                    <Skeleton
                        width="60px"
                        height="15px"
                    />

                    <Skeleton
                        width="100%"
                        height="42px"
                    />

                </div>


                {/* Category */}

                <div className="internshipFormSkeletonGroup">

                    <Skeleton
                        width="90px"
                        height="15px"
                    />

                    <Skeleton
                        width="100%"
                        height="42px"
                    />

                </div>


                {/* Level */}

                <div className="internshipFormSkeletonGroup">

                    <Skeleton
                        width="60px"
                        height="15px"
                    />

                    <Skeleton
                        width="100%"
                        height="42px"
                    />

                </div>


                {/* Notes */}

                <div className="internshipFormSkeletonGroup">

                    <Skeleton
                        width="100px"
                        height="15px"
                    />

                    <Skeleton
                        width="100%"
                        height="42px"
                    />

                </div>


                {/* Tasks */}

                <div className="internshipFormSkeletonGroup">

                    <Skeleton
                        width="100px"
                        height="15px"
                    />

                    <Skeleton
                        width="100%"
                        height="42px"
                    />

                </div>


                {/* Button */}

                <Skeleton
                    width="20%"
                    height="42px"
                    borderRadius="8px"
                />

            </div>

        </div>
    );
}
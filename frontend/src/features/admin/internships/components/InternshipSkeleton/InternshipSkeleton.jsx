import Skeleton from "../../../../dashboard/common/LoaderPage/Skeleton";
import "./InternshipSkeleton.css";

export default function InternshipSkeleton() {

    return (
        <div className="internshipSkeletonGrid">

            {Array.from({ length: 8 }).map((_, index) => (

                <div
                    className="internshipSkeletonCard"
                    key={index}
                >

                    {/* Image */}

                    <Skeleton
                        width="100%"
                        height="160px"
                        borderRadius="15px"
                    />


                    {/* Title */}

                    <Skeleton
                        width="75%"
                        height="20px"
                    />


                    {/* Description */}

                    <div className="internshipSkeletonDescription">

                        <Skeleton
                            width="100%"
                            height="13px"
                        />

                        <Skeleton
                            width="90%"
                            height="13px"
                        />

                        <Skeleton
                            width="65%"
                            height="13px"
                        />

                    </div>


                    {/* Meta */}

                    <div className="internshipSkeletonMeta">

                        <Skeleton
                            width="70px"
                            height="13px"
                        />

                        <Skeleton
                            width="70px"
                            height="13px"
                        />

                        <Skeleton
                            width="70px"
                            height="13px"
                        />

                    </div>

                </div>

            ))}

        </div>
    );
}
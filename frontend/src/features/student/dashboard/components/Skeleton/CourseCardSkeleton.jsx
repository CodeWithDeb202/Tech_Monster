import Skeleton from "../../../../dashboard/common/LoaderPage/Skeleton";

const CourseCardSkeleton = () => {
    return (
        <div className="course-card-skeleton">

            <Skeleton
                width="100%"
                height="140px"
                borderRadius="14px"
            />

            <Skeleton
                width="90%"
                height="20px"
                borderRadius="6px"
            />

            <Skeleton
                width="100%"
                height="14px"
                borderRadius="5px"
            />

            <Skeleton
                width="75%"
                height="14px"
                borderRadius="5px"
            />

            <div className="course-skeleton-meta">

                <Skeleton
                    width="80px"
                    height="14px"
                    borderRadius="5px"
                />

                <Skeleton
                    width="80px"
                    height="14px"
                    borderRadius="5px"
                />

            </div>

            <Skeleton
                width="110px"
                height="42px"
                borderRadius="10px"
            />

        </div>
    );
};

export default CourseCardSkeleton;
import Skeleton from "../../../../../components/Dashboard/common/LoaderPage/Skeleton";
import CourseCardSkeleton from "./CourseCardSkeleton";

const CourseSectionSkeleton = () => {
    return (
        <section className="course-section-skeleton">

            <div className="skeleton-section-heading">

                <Skeleton
                    width="180px"
                    height="28px"
                    borderRadius="7px"
                />

                <Skeleton
                    width="180px"
                    height="15px"
                    borderRadius="5px"
                />

            </div>

            <div className="course-skeleton-grid">

                {Array.from({ length: 6 }).map((_, index) => (
                    <CourseCardSkeleton key={index} />
                ))}

            </div>

        </section>
    );
};

export default CourseSectionSkeleton;
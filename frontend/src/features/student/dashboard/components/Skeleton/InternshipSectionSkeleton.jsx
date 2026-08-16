import Skeleton from "../../../../dashboard/common/LoaderPage/Skeleton";
import CourseCardSkeleton from "./CourseCardSkeleton";

const InternshipSectionSkeleton = () => {
    return (
        <section className="internship-section-skeleton">

            <div className="skeleton-section-heading">

                <Skeleton
                    width="210px"
                    height="28px"
                    borderRadius="7px"
                />

                <Skeleton
                    width="200px"
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

export default InternshipSectionSkeleton;
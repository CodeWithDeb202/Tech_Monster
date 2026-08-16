import Skeleton from "../../../../dashboard/common/LoaderPage/Skeleton";
import ContinueCardSkeleton from "./ContinueCardSkeleton";

const ContinueLearningSkeleton = () => {
    return (
        <section className="continue-learning-skeleton">

            <div className="skeleton-section-heading">

                <Skeleton
                    width="230px"
                    height="30px"
                    borderRadius="7px"
                />

                <Skeleton
                    width="160px"
                    height="15px"
                    borderRadius="5px"
                />

            </div>

            <div className="continue-skeleton-grid">

                {Array.from({ length: 4 }).map((_, index) => (
                    <ContinueCardSkeleton key={index} />
                ))}

            </div>

        </section>
    );
};

export default ContinueLearningSkeleton;
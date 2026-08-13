import Skeleton from "../../../../../components/Dashboard/common/LoaderPage/Skeleton";

const ContinueCardSkeleton = () => {
    return (
        <div className="continue-card-skeleton">

            <Skeleton
                width="100%"
                height="150px"
                borderRadius="14px"
            />

            <Skeleton
                width="75%"
                height="22px"
                borderRadius="6px"
            />

            <Skeleton
                width="45%"
                height="16px"
                borderRadius="6px"
            />

            <Skeleton
                width="calc(100% - 2rem)"
                height="8px"
                borderRadius="10px"
            />

            <div className="continue-skeleton-meta">

                <Skeleton
                    width="90px"
                    height="14px"
                    borderRadius="5px"
                />

                <Skeleton
                    width="90px"
                    height="14px"
                    borderRadius="5px"
                />

            </div>

            <Skeleton
                width="110px"
                height="40px"
                borderRadius="10px"
            />

        </div>
    );
};

export default ContinueCardSkeleton;
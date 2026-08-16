import Skeleton from "../../../../dashboard/common/LoaderPage/Skeleton";

const DashboardHeaderSkeleton = () => {
    return (
        <div className="dashboard-header-skeleton">

            <Skeleton
                width="190px"
                height="45px"
                borderRadius="10px"
            />

            <Skeleton
                width="360px"
                height="16px"
                borderRadius="6px"
            />

        </div>
    );
};

export default DashboardHeaderSkeleton;
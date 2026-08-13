import {DashboardHeaderSkeleton, ContinueLearningSkeleton, CourseSectionSkeleton, InternshipSectionSkeleton} from '../../../../../components/Dashboard/Student/Dashboard/Skeleton/index.js';

import "./DashboardSkeleton.css";

const DashboardSkeleton = () => {
    return (
        <div className="dashboard-skeleton">

            <DashboardHeaderSkeleton />

            <ContinueLearningSkeleton />

            <CourseSectionSkeleton />

            <InternshipSectionSkeleton />

        </div>
    );
};

export default DashboardSkeleton;
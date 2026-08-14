import "./Dashboard.css";

import { useEffect, useState } from "react";

import DashboardHeader from "../../../../components/Dashboard/Student/Dashboard/DashboardHeader";
import ContinueLearning from "../../../../components/Dashboard/Student/Dashboard/ContinueLearning";
import AllInternship from "../../../../components/Dashboard/Student/Dashboard/AllInternship";
import AllCourses from "../../../../components/Dashboard/Student/Dashboard/AllCourses";

import DashboardSkeleton from "./DashboardSkeleton";

import api from "../../../../services/api/axios";
import { API } from "../../../../services/api/endpoints";
import { toast } from "react-toastify";

function Dashboard() {

    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(true);


    const loadDashboard = async () => {

        try {

            setLoading(true);

            const { data } = await api.get(
                API.DASHBOARD.STUDENT
            );

            setDashboard(data.dashboard);

        } catch (err) {
            console.log(err);
            toast.error("Failed to load dashboard", err?.message);

        } finally {

            setLoading(false);

        }

    };


    useEffect(() => {

        // eslint-disable-next-line react-hooks/set-state-in-effect
        loadDashboard();

    }, []);


    return (
        <div className="dashboard-page">

            {loading ? (

                <DashboardSkeleton />

            ) : (

                <>

                    <DashboardHeader />

                    <ContinueLearning
                        learningItems={[
                            ...(dashboard?.internships || []),
                            ...(dashboard?.courses || [])
                        ]}
                    />

                    <AllCourses
                        courses={
                            dashboard?.allCourses || []
                        }
                        refreshDashboard={loadDashboard}
                    />

                    <AllInternship
                        internships={
                            dashboard?.allInternships || []
                        }
                        refreshDashboard={loadDashboard}
                    />

                </>

            )}

        </div>
    );
}

export default Dashboard;
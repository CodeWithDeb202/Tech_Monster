import './Dashboard.css';

import { useEffect, useState } from "react";

import DashboardHeader from "../../../../components/Dashboard/Student/Dashboard/DashboardHeader";
import ContinueLearning from "../../../../components/Dashboard/Student/Dashboard/ContinueLearning";
import AllInternship from "../../../../components/Dashboard/Student/Dashboard/AllInternship";
import api from "../../../../services/api/axios";
import { API } from "../../../../services/api/endpoints";
import AllCourses from '../../../../components/Dashboard/Student/Dashboard/AllCourses';

function Dashboard() {
    const [dashboard, setDashboard] = useState(null);

    const loadDashboard = async () => {
        try {
            const { data } = await api.get(API.DASHBOARD.STUDENT);

            console.log("studentdashboard")
            console.log("data:= ", data.dashboard?.internships)
            setDashboard(data.dashboard);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        loadDashboard();
    }, []);


    return (

        <div className="dashboard-page">

            <DashboardHeader />
            <ContinueLearning
                internships={dashboard?.internships || []}
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

        </div>

    )

}

export default Dashboard;

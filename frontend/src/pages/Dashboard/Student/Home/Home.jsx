import "./Home.css";

import { useEffect, useState } from "react";
import api from "../../../../services/api/axios";
import { API } from '../../../../services/api/endpoints';

import WelcomeCard from "../../../../components/Dashboard/Student/Home/WelcomeCard";
import ProfileSummary from "../../../../components/Dashboard/Student/Home/ProfileSummary";
import StatsCards from "../../../../components/Dashboard/Student/Home/StatsCards";
import InternshipRecommendation from "../../../../components/Dashboard/Student/Home/InternshipRecommendation";
import SuggestedUsers from "../../../../components/Dashboard/Student/Home/SuggestedUsers";
import LearningStreak from "../../../../components/Dashboard/Student/Home/LearningStreak";
import LearningAnalytics from "../../../../components/Dashboard/Student/Home/LearningAnalytics";

import LoaderPage from '../../../../components/Dashboard/common/LoaderPage';


const Home = () => {

  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadDashboard = async () => {

    try {
      const res = await api.get(API.DASHBOARD.STUDENT);

      console.log("Home:Data=", res.data.dashboard);


      setDashboard(res.data.dashboard);

    } catch (err) {
      console.log("Dashboard Error:", err);
      console.log(err.response?.data);
      console.log(err.response?.status);
    } finally {

      setLoading(false);

    }
  };
  
  if (loading) {
    return (
      <LoaderPage
        message="Loading your dashboard..."
        size={60}
      />
    );
  }
  
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadDashboard();

  }, []);


  const analytics = dashboard?.analytics || {

    completedCourses: 0,

    hours: 0,

    growth: 0,

    weeklyData: [0, 0, 0, 0, 0, 0, 0]

  };



  return (
    <div className="home-page">

      <WelcomeCard
        username={dashboard?.user}
        stats={dashboard?.stats}
        streak={dashboard?.streak}
      />

      <ProfileSummary username={dashboard?.user} />

      <StatsCards stats={dashboard?.stats} />

      <LearningStreak streak={dashboard?.streak} />

      <LearningAnalytics analytics={analytics} />

      <InternshipRecommendation internships={dashboard?.recommendedInternships || []} />

      <SuggestedUsers users={dashboard?.suggestedUsers} />

    </div>
  );
};

export default Home;
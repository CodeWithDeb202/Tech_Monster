import "./DashboardLayout.css";

import { useState} from "react";

import Navbar from "../../components/Dashboard/common/Navbar";
import Sidebar from "../../components/Dashboard/common/Sidebar";
import Footer from "../../components/Dashboard/common/Footer";
import Main from "../../components/Dashboard/common/Main";

function DashboardLayout({ role = "student" }) {
    const [collapsed, setCollapsed] = useState(false);

    const handleToggleCollapse = () => {
        setCollapsed((prev) => !prev);
    };

    // A course is considered "completed" when ALL of its tasks are approved.
    // We derive this from the global `all_tasks_completed` signal that Task.jsx
    // writes to localStorage whenever the task completion state changes.
    const readAllTasksCompleted = () => {
        try {
            return localStorage.getItem("all_tasks_completed") === "true";
        } catch {
            return false;
        }
    };

    return (
        <>
            <div className={`dashboardContainer ${collapsed ? "sidebar-collapsed" : ""}`}>
                {/* TOP NAVBAR WITH LOGO */}
                <Navbar role={role} />

                <div id="sideMain">
                    {/* SIDEBAR */}
                    <Sidebar
                        role={role}
                        isCourseCompleted={
                            role === "student" ? readAllTasksCompleted() : false
                        }
                        collapsed={collapsed}
                        onToggleCollapse={handleToggleCollapse}
                    />

                    {/* MAIN CONTENT AREA */}
                    <Main />
                </div>

                {/* FOOTER */}
                <Footer />
            </div>
        </>
    );
}

export default DashboardLayout;

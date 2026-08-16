import "./DashboardLayout.css";

import { useState } from "react";

import Navbar from "../../features/dashboard/common/Navbar";
import Sidebar from "../../features/dashboard/common/Sidebar";
import Footer from "../../features/dashboard/common/Footer";
import Main from "../../features/dashboard/common/Main";

function DashboardLayout({ role = "student" }) {

    const [collapsed, setCollapsed] = useState(false);

    // Mobile sidebar state
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

    const handleToggleCollapse = () => {
        setCollapsed((prev) => !prev);
    };

    const handleOpenMobileSidebar = () => {
        setMobileSidebarOpen(true);
    };

    const handleCloseMobileSidebar = () => {
        setMobileSidebarOpen(false);
    };

    // Course completion
    const readAllTasksCompleted = () => {
        try {
            return localStorage.getItem("all_tasks_completed") === "true";
        } catch {
            return false;
        }
    };

    return (
        <div
            className={`dashboardContainer ${
                collapsed ? "sidebar-collapsed" : ""
            }`}
        >

            {/* ================= NAVBAR ================= */}
            <Navbar
                role={role}
                onMobileMenuClick={handleOpenMobileSidebar}
            />


            <div id="sideMain">

                {/* ================= SIDEBAR ================= */}
                <Sidebar
                    role={role}
                    isCourseCompleted={
                        role === "student"
                            ? readAllTasksCompleted()
                            : false
                    }
                    collapsed={collapsed}
                    onToggleCollapse={handleToggleCollapse}
                    mobileSidebarOpen={mobileSidebarOpen}
                    onCloseMobileSidebar={handleCloseMobileSidebar}
                />


                {/* ================= MAIN CONTENT ================= */}
                <Main />

            </div>


            {/* ================= FOOTER ================= */}
            <Footer />

        </div>
    );
}

export default DashboardLayout;
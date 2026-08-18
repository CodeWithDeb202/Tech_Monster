import "./DashboardLayout.css";

import { useEffect, useState } from "react";

import Navbar from "../../features/dashboard/common/Navbar";
import Sidebar from "../../features/dashboard/common/Sidebar";
import Footer from "../../features/dashboard/common/Footer";
import Main from "../../features/dashboard/common/Main";

function DashboardLayout({ role = "student" }) {

    const [collapsed, setCollapsed] = useState(false);

    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

    const [enrolledCourse, setEnrolledCourse] = useState(null);

    // ==========================================
    // GET ACTIVE / ENROLLED LEARNING
    // ==========================================

    useEffect(() => {

        const loadActiveLearning = () => {

            try {

                const storedLearning =
                    localStorage.getItem("activeLearning");

                if (storedLearning) {

                    const learning =
                        JSON.parse(storedLearning);

                    setEnrolledCourse(learning);

                } else {

                    setEnrolledCourse(null);

                }

            } catch (error) {

                console.error(
                    "Failed to parse activeLearning:",
                    error
                );

                setEnrolledCourse(null);
            }
        };


        loadActiveLearning();

    }, []);


    // ==========================================
    // SIDEBAR COLLAPSE
    // ==========================================

    const handleToggleCollapse = () => {

        setCollapsed((prev) => !prev);

    };


    // ==========================================
    // MOBILE SIDEBAR
    // ==========================================

    const handleOpenMobileSidebar = () => {

        setMobileSidebarOpen(true);

    };


    const handleCloseMobileSidebar = () => {

        setMobileSidebarOpen(false);

    };


    // ==========================================
    // COURSE COMPLETION
    // ==========================================

    const readAllTasksCompleted = () => {

        try {

            return (
                localStorage.getItem(
                    "all_tasks_completed"
                ) === "true"
            );

        } catch {

            return false;

        }
    };


    return (

        <div
            className={`dashboardContainer ${collapsed
                    ? "sidebar-collapsed"
                    : ""
                }`}
        >

            {/* ================= NAVBAR ================= */}

            <Navbar
                role={role}
                onMobileMenuClick={
                    handleOpenMobileSidebar
                }
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

                    onToggleCollapse={
                        handleToggleCollapse
                    }

                    mobileSidebarOpen={
                        mobileSidebarOpen
                    }

                    onCloseMobileSidebar={
                        handleCloseMobileSidebar
                    }

                    enrolledCourse={
                        enrolledCourse
                    }
                />


                {/* ================= MAIN ================= */}

                <Main />

            </div>


            {/* ================= FOOTER ================= */}

            <Footer />

        </div>

    );
}

export default DashboardLayout;
import { Routes, Route } from 'react-router-dom';
// Errors page

import AuthenticationRequired from "../pages/StatusPages/AuthenticationRequired";
import Unauthorized from "../pages/StatusPages/Unauthorized";
import NotFound from "../pages/StatusPages/NotFound";
import TooManyRequests from "../pages/StatusPages/TooManyRequests";
import ServerError from "../pages/StatusPages/ServerError";
import Maintenance from "../pages/StatusPages/Maintenance";
import SessionExpired from "../pages/StatusPages/SessionExpired";
import AccountBlocked from "../pages/StatusPages/AccountBlocked";
import SomethingWentWrong from "../pages/StatusPages/SomethingWentWrong";
import Offline from "../pages/StatusPages/Offline";

import Landing from "../pages/LandingPages/Landing";

import Contact from "../pages/LandingPages/Contact";

import TermsAndConditions from "../components/Common/TermsAndConditions";

import Login from '../pages/Auth/Login';
import Signup from '../pages/Auth/Signup';
import AdminLogin from '../pages/Auth/AdminLogin';
import ForgotPassword from '../pages/Auth/ForgotPassword';
import ResetPassword from '../pages/Auth/ResetPassword';


import DashboardLayout from '../layouts/Dashboard';
import ProtectedRoute from './ProtectedRoute';


import VerifySignupOTP from '../pages/Auth/VerifySignupOTP';
import VerifyResetOTP from '../pages/Auth/VerifyResetOTP';

// Student Dashboard
import StudentHome from '../pages/Dashboard/Student/Home';
import StudentDashboard from '../pages/Dashboard/Student/Dashboard';
import Lessions from '../pages/Dashboard/Student/Lessions';
import StudentTask from '../pages/Dashboard/Student/Tasks';
import StudentAttendance from '../pages/Dashboard/Student/Attendance';
import StudentAccount from '../pages/Dashboard/Student/Account';
import StudentCertificate from '../pages/Dashboard/Student/Certificate';
import StudentSetting from '../pages/Dashboard/Student/Setting';

import StudentProfile from '../pages/Dashboard/Common/StudentProfile';



import Notification from '../components/Dashboard/common/Notification';
import Message from '../pages/Dashboard/Common/Message';
import HelpSupport from '../components/Dashboard/common/Help&Supp/HelpSupport';

// Admin Dashboard
import Overview from '../pages/Dashboard/Admin/Overview';
import Students from '../pages/Dashboard/Admin/Students';
import StudentDetails from "../pages/Dashboard/Admin/Students/StudentDetails";
import Reports from '../pages/Dashboard/Admin/Reports';
import Internships from '../pages/Dashboard/Admin/Internships';
import Course from '../pages/Dashboard/Admin/Course';
import CourseForm from '../components/Dashboard/Admin/Course/CoursesForm';
import TaskApproval from '../pages/Dashboard/Admin/TasksApproval';
import TaskApprovalDetails from "../pages/Dashboard/Admin/TasksApproval/TaskApprovalDetails";
import CertificateApproval from '../pages/Dashboard/Admin/CertificateApproval';
import InternshipsForm from '../components/Dashboard/Admin/Internships/InternshipsForm';






function AppRoutes() {
    return (
        <>
            <Routes>

                {/* Public Routes */}
                <Route path='/' element={<Landing />} />
                <Route path='/contact' element={<Contact />} />

                <Route path='/login' element={<Login />} />
                <Route path='/admin_login' element={<AdminLogin />} />
                <Route path='/signup' element={<Signup />} />
                <Route path='/forgot-password' element={<ForgotPassword />} />
                <Route path="/verify-signup-otp" element={<VerifySignupOTP />} />
                <Route path='/reset-password' element={<ResetPassword />} />
                <Route path="/verify-reset-otp" element={<VerifyResetOTP />} />
                <Route path="/terms-and-conditions" element={<TermsAndConditions />} />


                {/* Status Pages */}
                <Route path="/auth-required" element={<AuthenticationRequired />} />
                <Route path="/unauthorized" element={<Unauthorized />} />
                <Route path="/404" element={<NotFound />} />
                <Route path="/429" element={<TooManyRequests />} />
                <Route path="/500" element={<ServerError />} />
                <Route path="/503" element={<Maintenance />} />
                <Route path="/session-expired" element={<SessionExpired />} />
                <Route path="/account-blocked" element={<AccountBlocked />} />
                <Route path="/something-went-wrong" element={<SomethingWentWrong />} />
                <Route path="/offline" element={<Offline />} />



                {/* Student Dashboard Routes (Protected) */}
                <Route
                    path="/student"
                    element={
                        <ProtectedRoute role="student">
                            <DashboardLayout role="student" />
                        </ProtectedRoute>
                    }
                >
                    <Route index element={<StudentHome />} />
                    <Route path="dashboard" element={<StudentDashboard />} />
                    <Route path="courses/:slug" element={<Lessions />} />
                    {/* 1. Base Lessions Page */}
                    <Route path="lessions" element={<Lessions />} />

                    {/* 2. Specific Course/Internship Lessions Page (Dynamic Slug Fix) */}
                    <Route path="lessions/:slug" element={<Lessions />} />
                    <Route path="lessions/:courseSlug/:lessonSlug" element={<Lessions />} />

                    {/* 3. Spelling mismatch handler (Jodi 'lessons' use hai thae) */}
                    <Route path="lessons" element={<Lessions />} />
                    <Route path="lessons/:slug" element={<Lessions />} />
                    <Route path="lessons/:courseSlug/:lessonSlug" element={<Lessions />} />


                    <Route path="tasks" element={<StudentTask />} />
                    <Route path="attendance" element={<StudentAttendance />} />
                    <Route path="account" element={<StudentAccount />} />
                    <Route path="user-profile" element={<StudentProfile />} />
                    <Route path="certificate" element={<StudentCertificate />} />
                    <Route path="settings" element={<StudentSetting />} />
                    <Route path="notification" element={<Notification />} />
                    <Route path="message" element={<Message />} />
                    <Route path="help&support" element={<HelpSupport />} />
                </Route>



                {/* Admin Dashboard Routes (Protected) */}
                <Route
                    path="/admin"
                    element={
                        <ProtectedRoute role="admin">
                            <DashboardLayout role="admin" />
                        </ProtectedRoute>
                    }
                >
                    <Route index element={<Overview />} />
                    <Route path='students' element={<Students />} />
                    <Route path="students/:id" element={<StudentDetails />} />
                    <Route path='internships' element={<Internships />} />
                    <Route path='internships-form' element={<InternshipsForm />} />

                    <Route path='courses' element={<Course />} />
                    <Route path='course-form' element={<CourseForm />} />

                    <Route path='tasks' element={<TaskApproval />} />
                    <Route

                        path="tasks/:id"

                        element={<TaskApprovalDetails />}

                    />
                    <Route path='reports' element={<Reports />} />
                    <Route path='certificates' element={<CertificateApproval />} />
                    <Route path='settings' element={<StudentSetting />} />
                </Route>




                {/* 404 Fallback */}
                <Route path="*" element={<NotFound />} />

            </Routes>
        </>
    )
}

export default AppRoutes;

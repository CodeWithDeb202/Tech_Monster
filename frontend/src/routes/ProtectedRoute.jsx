
import { Navigate, useLocation } from "react-router-dom";
import useAuth from "../shared/hooks/useAuth";

function ProtectedRoute({ children, role }) {
    const { isAuthenticated, user } = useAuth();
    const location = useLocation();

    if (!isAuthenticated) {

        if (sessionStorage.getItem("logoutSuccess")) {
            return <Navigate to="/login" replace />;
        }

        return (
            <Navigate
                to="/auth-required"
                replace
                state={{ from: location.pathname }}
            />
        );
    }

    if (role && user?.role !== role) {
        return <Navigate to="/unauthorized" replace />;
    }

    return children;
}

export default ProtectedRoute;
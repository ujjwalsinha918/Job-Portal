import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, role, user}) {

    // If not logged in → redirect to login
    if(!user) {
        return <Navigate to="/login" replace />;
    }

    // If role doesn’t match → redirect to unauthorized page
    if(role && user.role !== role) {
        return <Navigate to="/unauthorized" replace />;
    }

    // Otherwise, render the requested page
    return children;
}
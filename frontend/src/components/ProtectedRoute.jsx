import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getCurrentUser } from "../utils/auth";

export default function ProtectedRoute({ children, role}) { 
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(()=> {
        (async () => {
            const u = await getCurrentUser();
            setUser(u);
            setLoading(false);
        })();
    }, []);

    if (loading) return <div>Loading...</div>;

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
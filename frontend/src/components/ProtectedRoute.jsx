import { Navigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { getCurrentUser } from "../utils/auth";

export default function ProtectedRoute({ children, role }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const lastFetchTime = useRef(0);
  const FETCH_COOLDOWN = 2000; // 2 seconds cooldown between fetches

  const fetchUser = async (force = false) => {
    const now = Date.now();
    
    // Skip if we fetched recently (unless forced)
    if (!force && now - lastFetchTime.current < FETCH_COOLDOWN) {
      console.log("⏭️ Skipping user fetch - too soon since last fetch");
      return;
    }
    
    console.log("🔄 Fetching current user...");
    setLoading(true);
    try {
      const u = await getCurrentUser();
      setUser(u);
      lastFetchTime.current = now;
      console.log("✅ User fetched successfully");
    } catch (err) {
      console.error("❌ Failed to fetch current user:", err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch (forced)
    fetchUser(true);

    // Debounced refetch on focus or tab visible again
    let focusTimeout;
    let visibilityTimeout;

    const handleFocus = () => {
      console.log("👁️ Window focused");
      clearTimeout(focusTimeout);
      // Wait 500ms after focus before refetching
      focusTimeout = setTimeout(() => fetchUser(), 500);
    };

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        console.log("👁️ Tab visible");
        clearTimeout(visibilityTimeout);
        // Wait 500ms after visibility change before refetching
        visibilityTimeout = setTimeout(() => fetchUser(), 500);
      }
    };

    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearTimeout(focusTimeout);
      clearTimeout(visibilityTimeout);
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (role && user.role !== role) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}
import axios from "axios";

export const getCurrentUser = async () => {
    const token = localStorage.getItem("token");
    if (!token) return null;
    try {
        const res = await axios.get("http://localhost:8000/auth/me", {
            headers: { Authorization: `Bearer ${token}` }
        });
        return res.data; // { id, email, role, ... }
    } catch {
        return null;
    }
};

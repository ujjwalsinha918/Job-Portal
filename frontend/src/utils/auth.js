import axios from "axios";

export const getCurrentUser = async () => {
    try {
        const res = await axios.get("http://localhost:8000/auth/me", {
            withCredentials: true,   
        });
        return res.data; // { id, email, role, ... }
    } catch (err){
        console.error("getCurrentUser error:", err);
        return null;
    }
};
// checks if the user is logged in and fetches the logged-in user's details from the backend using the saved JWT token
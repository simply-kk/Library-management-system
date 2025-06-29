import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import axios from "axios";

const ProtectedRoute = ({ allowedRole }) => {
    const [sessionValid, setSessionValid] = useState(true);
    const role = localStorage.getItem("role");

    useEffect(() => {
        axios.get("http://localhost:5000/api/auth/check-session", { withCredentials: true })
            .then((res) => {
                if (res.data.user.role !== allowedRole) {
                    window.location.href = allowedRole === "librarian" ? "/admin-dashboard" : "/student-dashboard";
                }
            })
            .catch(() => {
                localStorage.removeItem("role");
                window.location.href = "/";
                setSessionValid(false);
            });
    }, [allowedRole]);

    if (!sessionValid) return null;
    
    return <Outlet />;
};

export default ProtectedRoute;
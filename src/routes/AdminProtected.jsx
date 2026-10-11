import { Navigate } from "react-router";
import { useAuth } from "../contexts/AuthProvider";

const AdminProtected = ({ children }) => {
    const { authUser, accessToken } = useAuth();

    if (!authUser || !accessToken) {
        return <Navigate to="/" replace />;
    }

    if (authUser.role !== "admin") {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default AdminProtected;
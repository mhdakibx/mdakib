import { createContext, useContext, useState } from "react";
import toast from "react-hot-toast";

import { BASE_URL } from "../services/BaseUrl";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [authUser, setAuthUser] = useState(
        JSON.parse(localStorage.getItem("portfolio_user")) || null
    );

    const [accessToken, setAccessToken] = useState(
        localStorage.getItem("portfolio_token")
    );

    const login = async (email, password) => {
        try {
            const response = await fetch(`${BASE_URL}/api/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    password,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                toast.error(
                    data.message || "Invalid email or password"
                );

                return false;
            }

            localStorage.setItem(
                "portfolio_token",
                data.token
            );

            localStorage.setItem(
                "portfolio_user",
                JSON.stringify(data.user)
            );

            setAccessToken(data.token);
            setAuthUser(data.user);

            toast.success("Login successful");

            return true;
        } catch (error) {
            console.error("Login error:", error);

            toast.error("Something went wrong");

            return false;
        }
    };

    const logout = () => {
        localStorage.removeItem("portfolio_token");
        localStorage.removeItem("portfolio_user");

        setAccessToken(null);
        setAuthUser(null);

        toast.success("Logged out successfully");
    };

    const authInfo = {
        authUser,
        accessToken,
        login,
        logout,
    };

    return (
        <AuthContext.Provider value={authInfo}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};

export default AuthProvider;


import { createContext, useState, useContext, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { logOut } from "../lib/firebase/auth";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem("user");
        return savedUser ? JSON.parse(savedUser) : null;
    });
    const navigate = useNavigate();

    const loginUser = (data) => {
        setUser(data.user);
        const currentDate = new Date();
        const midnight = new Date(currentDate.getUTCFullYear(), currentDate.getUTCMonth(), currentDate.getUTCDate() + 1, 0, 0, 0);
        midnight.setUTCHours(midnight.getUTCHours());

        localStorage.setItem("user", JSON.stringify({
            ...data.user,
            expiredAt: midnight.getTime(),
        }));
        navigate(data.redirect || "/");
    };

    const logoutUser = async () => {
        setUser(null);
        localStorage.removeItem("user");
        await logOut();
        navigate("/login");
    };

    const value = useMemo(() => ({ user, setUser, loginUser, logoutUser }), [user, loginUser, logoutUser]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

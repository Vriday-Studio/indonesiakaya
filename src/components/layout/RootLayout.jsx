import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthProvider";

const RootLayout = () => {
    const location = useLocation();
    const { user } = useAuth();

    const protectedPath = ["claim", "profile", "collection"];
    if (!user && protectedPath.some((path) => location.pathname.includes(path))) {
        return <Navigate to="/login" />;
    }

    return (
        <main className="tw-class bg-primary-darker">
            <section className="font-playfair container min-h-screen relative">
                <Outlet />
            </section>
        </main>
    );
};

export default RootLayout;

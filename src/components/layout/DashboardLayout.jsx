import { Link, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthProvider";
import Sidebar from "./Sidebar";
import logoGaleri from "/images/logo-galeri-indonesia-kaya.png";

const LIST_SIDEBAR = [
    {
        title: "Dashboard",
        link: "/dashboard",
        permission: ["admin", "gro"],
    },
    {
        title: "Compiler",
        link: "/dashboard/compiler",
        permission: ["admin"],
    },
    {
        title: "Artwork",
        link: "/dashboard/artwork",
        permission: ["admin"],
    },
    {
        title: "Quiz",
        link: "/dashboard/quiz",
        permission: ["admin"],
    },
    {
        title: "Guide",
        link: "/dashboard/guide",
        permission: ["admin"],
    },
    {
        title: "Content",
        link: "/dashboard/content",
        permission: ["admin"],
    },
    {
        title: "Users",
        link: "/dashboard/users",
        permission: ["admin"],
    },
    {
        title: "Redeem",
        link: "/dashboard/redeem",
        permission: ["admin", "gro"],
    },
    {
        title: "Merchandise",
        link: "/dashboard/merchandise",
        permission: ["admin"],
    },
    {
        title: "Report",
        link: "/dashboard/report",
        permission: ["admin"],
    },
];

const DashboardLayout = () => {
    const location = useLocation();
    const { user, logoutUser } = useAuth();

    const normalizedPath = location.pathname.endsWith('/')
        ? location.pathname.slice(0, -1)
        : location.pathname;

    if (!user) return <Navigate to="/login" />;

    const isAllowed = LIST_SIDEBAR.find((item) => normalizedPath.includes(item.link) && item.permission.includes(user.Role));
    if (!isAllowed) return <Navigate to="/" />;

    return (
        <div className="tw-class">
            <div className="navbar bg-base-200 px-2 lg:px-10">
                <div className="navbar-start">
                    <label htmlFor="my-drawer" className="drawer-button btn btn-ghost btn-circle xl:hidden">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" />
                        </svg>
                    </label>
                    <Link to="/">
                        <img src={logoGaleri} alt="Logo" className="w-24"></img>
                    </Link>
                </div>
                <div className="navbar-end">
                    <div className="dropdown dropdown-end">
                        <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                            <div className="w-10 rounded-full">
                                <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
                            </div>
                        </div>
                        <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
                            <li>
                                <button onClick={() => logoutUser()}>Logout</button>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <Sidebar userRole={user.Role} listMenu={LIST_SIDEBAR} />
        </div>
    );
};

export default DashboardLayout;

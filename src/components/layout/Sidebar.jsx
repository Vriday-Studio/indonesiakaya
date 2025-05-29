import { useRef } from "react";
import { Link, Outlet } from "react-router-dom";

export default function Sidebar({ userRole, listMenu }) {
    const drawerRef = useRef(null);

    const handleLinkClick = () => {
        if (drawerRef.current.checked) {
            drawerRef.current.checked = false;
        }
    };

    return (
        <div className="drawer xl:drawer-open">
            <input id="my-drawer" type="checkbox" className="drawer-toggle" ref={drawerRef} />
            <div className="drawer-content">
                <Outlet />
            </div>
            <div className="drawer-side z-50">
                <label htmlFor="my-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
                <ul className="menu bg-base-200 text-base-content min-h-full w-44 p-4 flex flex-col gap-y-1">
                    {listMenu.map(
                        (item) =>
                            item.permission.includes(userRole) && (
                                <li key={item.title}>
                                    <Link onClick={handleLinkClick} to={item.link}>
                                        {item.title}
                                    </Link>
                                </li>
                            )
                    )}
                </ul>
            </div>
        </div>
    );
}

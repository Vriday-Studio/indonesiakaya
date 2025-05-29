import { Outlet } from "react-router-dom";

export default function AuthLayout() {
    return (
        <main className="tw-class font-playfair">
            <Outlet />
        </main>
    );
}

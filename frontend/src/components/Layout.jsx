import Navbar from "./Navbar";
import Footer from "./Footer";
import { Outlet, useLocation } from "react-router-dom";

export default function Layout() {
    const { pathname } = useLocation();

    // hide footer on cart & payment pages
    //   const hideFooter = pathname === "/cart" || pathname === "/pay";

    return (
        <>
            <Navbar />
                <Outlet />
            <Footer />

        </>
    );
}

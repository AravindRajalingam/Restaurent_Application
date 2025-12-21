import Navbar from "./Navbar";
import Footer from "./Footer";
import { Outlet, useLocation } from "react-router-dom";

export default function Layout() {
  const { pathname } = useLocation();

  // Optional: hide footer on specific pages
 // const hideFooter = pathname === "/cart" || pathname === "/pay";

  return (
    <div className="min-h-screen flex flex-col bg-base-200">
      {/* Navbar at top */}
      <Navbar />

      {/* Main content grows to push footer down */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Footer at bottom */}
      <Footer />
    </div>
  );
}

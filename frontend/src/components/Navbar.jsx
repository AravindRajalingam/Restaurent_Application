import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.jpg";

export default function Navbar() {
  const [showSearch, setShowSearch] = useState(false);
  const [mobileSearch, setMobileSearch] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);
  const navRef = useRef(null);
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const API_URL = import.meta.env.VITE_API_URL;


  // Close menus on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setOpenMenu(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);




  useEffect(() => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      setUser(null);
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await fetch(`${API_URL}/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`, // ✅ FIXED
          },
        });

        if (!res.ok) {
          throw new Error("Unauthorized");
        }

        const data = await res.json();
        setUser(data.user);
      } catch (err) {
        localStorage.removeItem("access_token");
        setUser(null);
      }
    };

    fetchUser();
  }, []);


  const handleLogout = () => {
    localStorage.removeItem("access_token"); // better than clear()
    setUser(null);
    setOpenMenu(null);
  };



  return (
    <>
      {/* NAVBAR */}
      <div
        ref={navRef}
        className="navbar sticky top-0 z-50
        px-3 sm:px-6 py-3
        bg-gradient-to-r from-[#0f172a] via-[#020617] to-[#0f172a]
        shadow-xl border-b border-white/10"
      >
        {/* LEFT */}
        <div className="navbar-start">
          <div className="relative">
            <button
              onClick={() => setOpenMenu(openMenu === "menu" ? null : "menu")}
              className="btn btn-ghost btn-circle text-amber-400"
            >
              {/* MENU SVG */}
              <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2"
                viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h10" />
              </svg>
            </button>

            {/* MENU DROPDOWN */}
            <ul
              className={`absolute left-0 mt-3
              w-screen sm:w-56
              bg-[#020617]/95 backdrop-blur-md
              rounded-none sm:rounded-xl
              shadow-2xl p-3 transition-all
              ${openMenu === "menu"
                  ? "opacity-100 scale-100"
                  : "opacity-0 scale-95 pointer-events-none"
                }`}
            >
              {["Home", "Item Menu", "About Us", "Contact"].map((item) => (
                <li key={item}>
                  <a
                    href={item === "Home" ? "/" : `/${item.toLowerCase().replace(" ", "-")}`}
                    className="block px-4 py-3 rounded-lg
                    text-gray-200 font-medium
                    hover:bg-amber-400/10 hover:text-amber-400"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* CENTER (VISIBLE ON MOBILE TOO) */}
        <div className="navbar-center flex gap-3">
          <img src={logo} className="w-10 h-10 sm:w-14 sm:h-14 rounded-full" />
          <div className="text-center leading-tight">
            <p className="text-lg sm:text-2xl font-serif font-bold text-amber-400 tracking-widest">
              MU FAMILY
            </p>
            <p className="text-[10px] sm:text-xs tracking-[0.35em] text-gray-400">
              RESTAURANT
            </p>
          </div>
        </div>

        {/* RIGHT */}
        <div className="navbar-end flex items-center gap-1 sm:gap-3">

          {/* DESKTOP SEARCH */}
          <div className={`hidden sm:block transition-all duration-300
            ${showSearch ? "w-52 opacity-100" : "w-0 opacity-0 overflow-hidden"}`}>
            <input
              type="text"
              placeholder="Search dishes..."
              className="input input-sm w-full rounded-full
              bg-black/70 text-white
              border border-amber-400
              placeholder:text-gray-400"
            />
          </div>

          {/* SEARCH BUTTON */}
          <button
            onClick={() => {
              if (window.innerWidth < 640) {
                setMobileSearch(true);
              } else {
                setShowSearch(!showSearch);
              }
            }}
            className="btn btn-ghost btn-circle text-amber-400"
          >
            {/* SEARCH SVG */}
            <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2"
              viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>

          {/* CART */}
          <button
            onClick={() => navigate("/cart")}
            className="btn btn-ghost btn-circle text-amber-400"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2"
              viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M3 3h2l.4 2M7 13h10l4-8H5.4
                M7 13L5.4 5
                M7 13l-2 4h14
                M10 21a1 1 0 100-2
                M18 21a1 1 0 100-2" />
            </svg>
          </button>

          {/* PROFILE */}
          <div className="relative">
            <button
              onClick={() => setOpenMenu(openMenu === "profile" ? null : "profile")}
              className="btn btn-ghost btn-circle text-amber-400"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2"
                viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M5.121 17.804A13.937 13.937 0 0112 16
                  c2.5 0 4.847.655 6.879 1.804M15 10
                  a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>

            <div
              className={`absolute right-0 mt-3 w-64
              bg-[#020617]/95 backdrop-blur-md
              rounded-xl shadow-2xl p-4 transition-all
              ${openMenu === "profile"
                  ? "opacity-100 scale-100"
                  : "opacity-0 scale-95 pointer-events-none"
                }`}
            >
              {!user ? (
                <button
                  onClick={() => navigate("/auth")}
                  className="w-full py-2 bg-amber-400
                  text-black font-semibold rounded-lg"
                >
                  Login
                </button>
              ) : (
                <>
                  <p className="text-white font-semibold">{user.name}</p>
                  <p className="text-sm text-gray-400 mb-3">{user.email}</p>
                  <button onClick={handleLogout}
                    className="w-full text-left px-3 py-2
                    text-red-400 hover:bg-red-400/10 rounded-lg">
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE SEARCH OVERLAY */}
      {mobileSearch && (
        <div className="fixed inset-0 z-[60]
        bg-base backdrop-blur-md p-4">
          <div className="flex items-center gap-3">
            <input
              autoFocus
              type="text"
              placeholder="Search dishes..."
              className="input input-lg w-full rounded-xl
              bg-black/70 text-white
              border border-amber-400
              placeholder:text-gray-400"
            />
            <button
              onClick={() => setMobileSearch(false)}
              className="btn btn-ghost text-amber-400 text-xl"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </>
  );
}

import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";



export default function Navbar() {
  const [showSearch, setShowSearch] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);
  const navRef = useRef(null);
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setOpenMenu(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  useEffect(() => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      setUser(null);
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
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
    localStorage.clear();
    setUser(null);
    setOpenMenu(null);
  };

  return (
    <div
      ref={navRef}
      className="navbar sticky top-0 z-50 px-6 py-5
      bg-gradient-to-r from-[#0f172a] via-[#020617] to-[#0f172a]
      shadow-xl border-b border-white/10"
    >
      {/* LEFT MENU */}
      <div className="navbar-start">
        <div className="relative">
          <button
            onClick={() =>
              setOpenMenu(openMenu === "menu" ? null : "menu")
            }
            className="btn btn-ghost btn-circle
            text-amber-400 hover:bg-amber-400/10 transition duration-300"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h10"
              />
            </svg>
          </button>

          <ul
            className={`absolute left-0 mt-3 w-56 rounded-xl
            bg-[#020617]/95 backdrop-blur-md shadow-2xl p-2
            transition-all origin-top-left
            ${openMenu === "menu"
                ? "opacity-100 scale-100"
                : "opacity-0 scale-95 pointer-events-none"
              }`}
          >
            {["Home", "Our Menu", "About Us", "Contact"].map((item) => (
              <li key={item}>
                <a
                  href={item === "Home" ? "/" : `${item.toLowerCase().replace(" ", "-")}`}
                  className="block px-4 py-2 rounded-lg
                  text-gray-200 font-medium tracking-wide
                  hover:bg-amber-400/10 hover:text-amber-400
                  transition duration-200"
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* CENTER LOGO */}
      <div className="navbar-center">
        <div className="text-center select-none">
          <p className="text-2xl lg:text-3xl font-serif font-bold
            text-amber-400 tracking-widest">
            MU FAMILY
          </p>
          <p className="text-xs tracking-[0.35em] text-gray-400">
            RESTAURANT
          </p>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="navbar-end flex items-center gap-3">
        {/* SEARCH */}
        <div
          className={`hidden sm:block transition-all duration-500
          ${showSearch
              ? "w-52 opacity-100"
              : "w-0 opacity-0 overflow-hidden"
            }`}
        >
          <input
            type="text"
            placeholder="Search dishes..."
            className="input input-sm w-full rounded-full
            bg-[#020617] text-white placeholder:text-gray-500
            border border-white/10 focus:ring-2 focus:ring-amber-400"
          />
        </div>

        <button
          onClick={() => setShowSearch(!showSearch)}
          className="btn btn-ghost btn-circle
          text-amber-400 hover:bg-amber-400/10 transition duration-300"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </button>


        {/* CART */}
        <button
        onClick={()=>navigate("/cart")}
          className="btn btn-ghost btn-circle
          text-amber-400 hover:bg-amber-400/10 transition duration-300"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 3h2l.4 2M7 13h10l4-8H5.4
              M7 13L5.4 5
              M7 13l-2 4h14
              M10 21a1 1 0 100-2 1 1 0 000 2
              M18 21a1 1 0 100-2 1 1 0 000 2"
            />
          </svg>

        </button>

        {/* PROFILE MENU */}
        <div className="relative">
          <button
            onClick={() =>
              setOpenMenu(openMenu === "profile" ? null : "profile")
            }
            className="btn btn-ghost btn-circle
    text-amber-400 hover:bg-amber-400/10 transition duration-300"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5.121 17.804A13.937 13.937 0 0112 16
        c2.5 0 4.847.655 6.879 1.804M15 10
        a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </button>

          <div
            className={`absolute right-0 mt-3 w-64 rounded-xl
    bg-[#020617]/95 backdrop-blur-md shadow-2xl p-4
    transition-all origin-top-right
    ${openMenu === "profile"
                ? "opacity-100 scale-100"
                : "opacity-0 scale-95 pointer-events-none"
              }`}
          >
            {!user ? (
              <button
                onClick={() => navigate("/auth")}
                className="w-full py-2 rounded-lg
        bg-amber-400 text-black font-semibold
        hover:bg-amber-300 transition"
              >
                Login
              </button>
            ) : (
              <>
                <p className="text-white font-semibold">{user.name}</p>
                <p className="text-sm text-gray-400 mb-4">{user.email}</p>

                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 rounded-lg
          text-red-400 hover:bg-red-400/10 transition duration-200"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>


      </div>
    </div>
  )
}
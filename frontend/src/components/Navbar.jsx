import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.jpg";
import { getAccessToken } from "./Utils/getAccessToken";

export default function Navbar() {
  const [showSearch, setShowSearch] = useState(false);
  const [mobileSearch, setMobileSearch] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);

  const [search, setSearch] = useState("");
  const [items, setItems] = useState([]);
  const [showResults, setShowResults] = useState(false);

  const navRef = useRef(null);
  const searchRef = useRef(null);

  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  const [user, setUser] = useState(null);
  const [cartCount, setCartCount] = useState(0);

  /* ---------------- CLOSE MENU / SEARCH OUTSIDE ---------------- */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(e.target)
      ) {
        setShowResults(false);
      }

      if (
        navRef.current &&
        !navRef.current.contains(e.target)
      ) {
        setOpenMenu(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ---------------- FETCH USER ---------------- */
  useEffect(() => {
    const token = getAccessToken();
    
    if (!token) return;

    fetch(`${API_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.ok && res.json())
      .then((data) => setUser(data?.user))
      .catch(() => {
        localStorage.removeItem("access_token");
        setUser(null);
      });
  }, []);

useEffect(() => {
  if (user) {
    fetchCartCount();
  }
}, [user]);


  /* ---------------- SEARCH (DEBOUNCE) ---------------- */
  useEffect(() => {
    if (!search.trim()) {
      setItems([]);
      setShowResults(false);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const res = await fetch(
          `${API_URL}/menu/search-item/${encodeURIComponent(search)}`
        );
        const data = await res.json();

        setItems(data?.data || []);
        setShowResults(true);
      } catch {
        setItems([]);
        setShowResults(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

 const fetchCartCount = async () => {
  try {
    const token = getAccessToken();

    const res = await fetch(`${API_URL}/cart/get-cart`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    if (data.success && Array.isArray(data.data)) {
      // ✅ total quantity (1 dosa + 2 juice = 3)
      const totalQty = data.data.reduce(
        (sum, item) => sum + item.qty,
        0
      );

      setCartCount(totalQty);
    }
  } catch (err) {
    console.error("Failed to fetch cart", err);
    setCartCount(0);
  }
};

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    setUser(null);
    setOpenMenu(null);
  };

  return (
    <>
      {/* ================= NAVBAR ================= */}
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
              ☰
            </button>

            {openMenu === "menu" && (
              <ul className="absolute left-0 mt-3
              w-screen sm:w-56
              bg-[#020617]/95 backdrop-blur-md
              rounded-none sm:rounded-xl
              shadow-2xl p-3">
                {["Home", "Item Menu", "My Orders", "About Us", "Contact"].map((item) => (
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
            )}
          </div>
        </div>

        {/* CENTER */}
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
          <div
            ref={searchRef}
            className={`relative hidden sm:block transition-all duration-300
            ${showSearch ? "w-52 opacity-100" : "w-0 opacity-0 overflow-hidden"}`}
          >
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onFocus={() => search && setShowResults(true)}
              placeholder="Search dishes..."
              className="input input-sm w-full rounded-full
              bg-black/70 text-white
              border border-amber-400
              placeholder:text-gray-400"
            />

            {showResults && (
              <ul className="menu bg-base-100 rounded-box mt-2
              shadow-lg absolute w-full z-50">
                {items.length ? (
                  items.map((item) => (
                    <li key={item.id}>
                      <button
                        onClick={() => {
                          navigate(`/item/${item.id}`);
                          setSearch("");
                          setItems([]);
                          setShowResults(false);
                          setShowSearch(false);
                        }}
                      >
                        {item.name}
                      </button>
                    </li>
                  ))
                ) : (
                  <li className="px-4 py-2 text-sm text-gray-500">
                    No items found
                  </li>
                )}
              </ul>
            )}
          </div>

          {/* SEARCH ICON */}
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
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1010.5 18a7.5 7.5 0 006.15-3.35z"
    />
  </svg>
</button>


          {/* CART */}
        <button
  onClick={() => navigate("/cart")}
  className="btn btn-ghost btn-circle relative text-amber-400"
>
  {/* Cart Icon */}
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 6m12-6l2 6M9 21a1 1 0 100-2 1 1 0 000 2zm8 0a1 1 0 100-2 1 1 0 000 2z"
    />
  </svg>

  {/* 🔴 Circular Notification Badge */}
  {cartCount > 0 && (
    <span className="
      badge badge-error badge-circle badge-sm
      absolute -top-1 -right-1
      text-xs font-bold
    ">
      {cartCount}
    </span>
  )}
</button>





          {/* PROFILE */}
          <div className="relative">
            <button
  onClick={() =>
    setOpenMenu(openMenu === "profile" ? null : "profile")
  }
  className="btn btn-ghost btn-circle text-amber-400"
>
  {/* User Icon */}
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15 7a3 3 0 11-6 0 3 3 0 016 0zM4 21a8 8 0 0116 0"
    />
  </svg>
</button>


            {openMenu === "profile" && (
              <div className="absolute right-0 mt-3 w-64
              bg-[#020617]/95 backdrop-blur-md
              rounded-xl shadow-2xl p-4">
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
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-3 py-2
                      text-red-400 hover:bg-red-400/10 rounded-lg"
                    >
                      Logout
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ================= MOBILE SEARCH ================= */}
      {mobileSearch && (
        <div className="fixed inset-0 z-[60]
        bg-black/60 backdrop-blur-md p-4">
          <div ref={searchRef}>
            <div className="flex items-center gap-3">
              <input
                autoFocus
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onFocus={() => setShowResults(true)}
                type="text"
                placeholder="Search dishes..."
                className="input input-lg w-full rounded-xl
                bg-black/70 text-white
                border border-amber-400
                placeholder:text-gray-400"
              />
              <button
                onClick={() => {
                  setMobileSearch(false);
                  setSearch("");
                  setItems([]);
                  setShowResults(false);
                }}
                className="btn btn-ghost text-amber-400 text-xl"
              >
                ✕
              </button>
            </div>

            {showResults && (
              <ul className="menu bg-base-100 rounded-box mt-4 shadow-xl">
                {items.length ? (
                  items.map((item) => (
                    <li key={item.id}>
                      <button
                        onClick={() => {
                          navigate(`/item/${item.id}`);
                          setMobileSearch(false);
                          setSearch("");
                          setShowResults(false);
                        }}
                      >
                        {item.name}
                      </button>
                    </li>
                  ))
                ) : (
                  <li className="px-4 py-2 text-sm text-gray-500">
                    No items found
                  </li>
                )}
              </ul>
            )}
          </div>
        </div>
      )}
    </>
  );
}

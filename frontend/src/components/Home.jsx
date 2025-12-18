import React, { useState, useEffect } from "react";
import hero1 from "../assets/hero1.avif"
import hero2 from "../assets/hero2.avif"
import hero3 from "../assets/hero3.avif"

export default function Home() {
    const [showSearch, setShowSearch] = useState(false);
    const [openMenu, setOpenMenu] = useState(null);
    const [currentSlide, setCurrentSlide] = useState(0);

    const slides = [
        {
            img: hero1,
            title: "Box Office News!",
            desc: "Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda excepturi exercitationem quasi.",
        },
        {
            img: hero2,
            title: "Delicious Foods",
            desc: "Discover a wide variety of dishes prepared with the finest ingredients.",
        },
        {
            img: hero3,
            title: "Cozy Ambiance",
            desc: "Experience dining in a cozy, welcoming environment perfect for all occasions.",
        },
    ];

    // Auto-slide effect
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 3000); // 3 seconds
        return () => clearInterval(interval);
    }, [slides.length]);

    return (
        <div className="w-full font-sans">
            {/* NAVBAR */}
            <div className="navbar sticky top-0 z-50 px-6 py-2
        bg-gradient-to-r from-[#f83f0c] via-[#0299b1] to-[#f83f0c]
        shadow-lg border-b border-white/10">

                {/* LEFT */}
                <div className="navbar-start">
                    <div
                        className="relative"
                        onMouseEnter={() => setOpenMenu("menu")}
                        onMouseLeave={() => setOpenMenu(null)}
                    >
                        <button className="btn btn-ghost btn-circle
              text-[#fbbf24]
              hover:bg-[#fbbf24]/20
              hover:rotate-90 hover:scale-110 transition-all duration-300">
                            <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2"
                                viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round"
                                    d="M4 6h16M4 12h16M4 18h10" />
                            </svg>
                        </button>

                        <ul
                            className={`absolute left-0 mt-2 w-56 rounded-xl
                bg-[#0b0b0b]/95 backdrop-blur-md
                shadow-xl p-2 transition-all origin-top-left
                ${openMenu === "menu"
                                    ? "opacity-100 scale-100"
                                    : "opacity-0 scale-95 pointer-events-none"}`}
                        >
                            {["Home", "Menu", "About", "Contact"].map(item => (
                                <li key={item}>
                                    <a className="block px-4 py-2 rounded-lg
                    text-gray-200 font-medium
                    hover:bg-[#fbbf24]/15 hover:text-[#fbbf24]
                    transition duration-200">
                                        {item}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* CENTER */}
                <div className="navbar-center">
                    <span className="text-2xl lg:text-3xl font-extrabold tracking-wider text-[#fbbf24]">
                        Restaurant
                    </span>
                </div>

                {/* RIGHT */}
                <div className="navbar-end flex items-center gap-3">
                    {/* SEARCH */}
                    <div className={`hidden sm:block transition-all duration-500
            ${showSearch ? "w-52 opacity-100" : "w-0 opacity-0 overflow-hidden"}`}>
                        <input
                            placeholder="Search food..."
                            className="input input-sm w-full rounded-full
                bg-[#121212] text-white placeholder:text-gray-400
                focus:ring-2 focus:ring-[#fbbf24]"
                        />
                    </div>

                    <button
                        onClick={() => setShowSearch(!showSearch)}
                        className="btn btn-ghost btn-circle
              text-[#fbbf24] hover:bg-[#fbbf24]/20 hover:scale-110 transition duration-300">
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2"
                            viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round"
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </button>

                    {/* PROFILE */}
                    <div
                        className="relative"
                        onMouseEnter={() => setOpenMenu("profile")}
                        onMouseLeave={() => setOpenMenu(null)}
                    >
                        <button className="btn btn-ghost btn-circle
              text-[#fbbf24] hover:bg-[#fbbf24]/20 hover:scale-110 transition duration-300">
                            <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2"
                                viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round"
                                    d="M5.121 17.804A13.937 13.937 0 0112 16
                  c2.5 0 4.847.655 6.879 1.804M15 10
                  a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </button>

                        <div
                            className={`absolute right-0 mt-2 w-60 rounded-xl
                bg-[#0b0b0b]/95 backdrop-blur-md
                shadow-xl p-4 transition-all origin-top-right
                ${openMenu === "profile"
                                    ? "opacity-100 scale-100"
                                    : "opacity-0 scale-95 pointer-events-none"}`}
                        >
                            <p className="text-white font-semibold">Siva</p>
                            <p className="text-sm text-gray-400 mb-3">siva@email.com</p>
                            <button className="w-full text-left px-3 py-2 rounded-lg
                text-red-400 hover:bg-red-400/10 transition duration-200">
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* HERO SLIDER */}
            <div className="relative w-full h-[500px] lg:h-[600px] overflow-hidden rounded-xl mt-4">
                {slides.map((slide, index) => (
                    <div
                        key={index}
                        className={`absolute top-0 left-0 w-full h-full transition-opacity duration-1000
        ${index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"}`}
                    >
                        <img
                            src={slide.img}
                            className="w-full h-full object-cover brightness-75"
                            alt={slide.title}
                        />

                        {/* Centered text */}
                        <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4 lg:px-0">
                            <div className="bg-black/30 p-6 rounded-lg max-w-xl">
                                <h1 className="text-3xl lg:text-5xl font-bold mb-4 text-white drop-shadow-lg">{slide.title}</h1>
                                <p className="text-white mb-6 text-sm lg:text-lg drop-shadow-md">{slide.desc}</p>
                                <a href="#!" className="btn btn-warning px-6 py-3 text-lg">Get Started</a>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

        </div>
    );
}

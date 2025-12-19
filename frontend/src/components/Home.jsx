import React, { useState, useEffect, useRef } from "react";

import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

export default function Home() {
  const [showSearch, setShowSearch] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const navRef = useRef(null);
  const navigate = useNavigate();
  const [user, setUser] = useState(null);



  const slides = [
    {
      title: "Welcome to Mu Family Restaurant",
      desc: "Delicious food, seamless ordering, and unforgettable experience.",
      img: "https://images.unsplash.com/photo-1552566626-52f8b828add9",
    },
    {
      title: "Taste the Best Dishes",
      desc: "Our chefs create magic with fresh ingredients and love.",
      img: "https://images.unsplash.com/photo-1541544741938-0af808871cc0",
    },
  ];

  const featuredDishes = [
    { name: "Grilled Salmon", desc: "Fresh Atlantic salmon grilled to perfection.", price: 25, img: "https://images.unsplash.com/photo-1562967916-eb82221dfb54" },
    { name: "Pasta Alfredo", desc: "Creamy Alfredo pasta with parmesan.", price: 18, img: "https://images.unsplash.com/photo-1589308078054-6e8bfcf5eab7" },
    { name: "Margherita Pizza", desc: "Classic pizza with mozzarella and basil.", price: 15, img: "https://images.unsplash.com/photo-1601924638867-3ec5d3c4d1e3" },
  ];

  const testimonials = [
    { name: "John Doe", position: "Food Blogger", feedback: "Amazing flavors and fantastic service!", avatar: "https://i.pravatar.cc/150?img=3" },
    { name: "Jane Smith", position: "Chef Enthusiast", feedback: "Best dining experience in town.", avatar: "https://i.pravatar.cc/150?img=5" },
    { name: "Robert Brown", position: "Traveler", feedback: "Loved the ambiance and food variety!", avatar: "https://i.pravatar.cc/150?img=7" },
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
      <div className="w-full">
        {/* Hero Slider */}
        <div className="relative w-full h-[500px] lg:h-[600px] overflow-hidden rounded-xl mt-1">
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
              <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4 lg:px-0">
                <div className="card bg-blue-900/80 p-8 rounded-xl shadow-2xl backdrop-blur-md">
                  <h1 className="text-3xl lg:text-5xl font-extrabold mb-4 text-yellow-400 drop-shadow-lg">{slide.title}</h1>
                  <p className="text-white mb-6 text-lg lg:text-xl drop-shadow-md">{slide.desc}</p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button onClick={()=>navigate("/item-menu")} className="btn btn-warning px-6 py-3 text-lg hover:scale-105 transition-transform duration-300">View Menu</button>
                    <button className="btn btn-outline btn-warning px-6 py-3 text-lg hover:scale-105 transition-transform duration-300">Reserve Table</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* About Section */}
        <section className="py-20 px-4 bg-gradient-to-b from-blue-900 to-blue-800 text-yellow-100 my-5 rounded-2xl">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">About Mu Family Restaurant</h2>
            <p className="text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
              At Mu Family Restaurant, we serve authentic cuisine made with the freshest ingredients. Our chefs blend traditional recipes with modern flair to give you a memorable dining experience.
            </p>
          </div>
        </section>

        {/* Featured Dishes */}
        <section className="py-20 px-4 bg-base-100">
          <div className="max-w-6xl mx-auto text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-blue-900">Our Signature Dishes</h2>
            <p className="text-gray-600">Hand-picked favorites you must try</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {featuredDishes.map((dish, index) => (
              <div key={index} className="card bg-white shadow-2xl hover:shadow-amber-400/40 transition-shadow duration-300 cursor-pointer">
                <figure>
                  <img src={dish.img} alt={dish.name} className="h-64 object-cover w-full rounded-t-xl" />
                </figure>
                <div className="card-body text-center">
                  <h3 className="card-title justify-center text-blue-900">{dish.name}</h3>
                  <p className="text-gray-600">{dish.desc}</p>
                  <div className="badge badge-outline mt-2 text-yellow-500 border-yellow-500">${dish.price}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20 px-4 bg-blue-50">
          <div className="max-w-6xl mx-auto text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-blue-900">Customer Reviews</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonials.map((item, index) => (
              <div key={index} className="card bg-white shadow-lg p-6 hover:scale-105 transition-transform duration-300">
                <p className="text-gray-700 italic mb-4">"{item.feedback}"</p>
                <div className="flex items-center gap-4">
                  <img src={item.avatar} alt={item.name} className="w-12 h-12 rounded-full border-2 border-yellow-400" />
                  <div>
                    <p className="font-semibold text-blue-900">{item.name}</p>
                    <p className="text-sm text-gray-500">{item.position}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Reservation Form */}
        <section id="reservation" className="py-20 px-4 bg-blue-900 text-yellow-100 my-5 rounded-2xl">
          <div className="max-w-6xl mx-auto text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Reserve a Table</h2>
            <p className="max-w-2xl mx-auto mb-8 text-lg">Book your table online and enjoy a delightful experience.</p>
            <form className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
              <input type="text" placeholder="Full Name" className="input input-bordered w-full bg-blue-800 text-yellow-100 border-yellow-400" required />
              <input type="email" placeholder="Email" className="input input-bordered w-full bg-blue-800 text-yellow-100 border-yellow-400" required />
              <input type="number" placeholder="Guests" className="input input-bordered w-full bg-blue-800 text-yellow-100 border-yellow-400" required />
              <input type="date" className="input input-bordered w-full md:col-span-1 bg-blue-800 text-yellow-100 border-yellow-400" required />
              <input type="time" className="input input-bordered w-full md:col-span-1 bg-blue-800 text-yellow-100 border-yellow-400" required />
              <button className="btn btn-warning w-full md:col-span-1 hover:scale-105 transition-transform duration-300">Reserve Now</button>
            </form>
          </div>
        </section>

      </div>


    </div>
  );
}

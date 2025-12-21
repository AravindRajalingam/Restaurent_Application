// import { useState } from "react";

// export default function Authentication() {
//   const states = [
//     { name: "Tamil Nadu", cities: ["Chennai", "Coimbatore", "Madurai"] },
//     { name: "Karnataka", cities: ["Bangalore", "Mysore", "Mangalore"] },
//     { name: "Maharashtra", cities: ["Mumbai", "Pune", "Nagpur"] },
//   ];

//   const [selectedState, setSelectedState] = useState("");
//   const [cities, setCities] = useState([]);
//   const [showSignupForm, setShowSignupForm] = useState(true);

//   const [resMessage, setResMessage] = useState(null);
//   const [errorMessage, setErrorMessage] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const handleStateChange = (e) => {
//     const stateName = e.target.value;
//     setSelectedState(stateName);
//     const state = states.find((s) => s.name === stateName);
//     setCities(state ? state.cities : []);
//   };

//   const handleSignup = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setErrorMessage(null);
//     setResMessage(null);

//     const data = {
//       name: e.target.name.value,
//       email: e.target.email.value,
//       password: e.target.password.value,
//       phone: e.target.mobile.value,
//       address_line: e.target.address.value,
//       city: e.target.city.value,
//       state: e.target.state.value,
//       pincode: e.target.pincode.value,
//     };

//     try {
//       const res = await fetch("http://localhost:5000/api/auth/signup", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(data),
//       });

//       const result = await res.json();

//       if (!res.ok || !result.success) {
//         setErrorMessage(result.message || "Signup failed");
//       } else {
//         setResMessage(result.message);
//       }
//     } catch (err) {
//       setErrorMessage("Network error. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSignin = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setErrorMessage(null);
//     setResMessage(null);

//     const data = {
//       email: e.target.email.value,
//       password: e.target.password.value,
//     };

//     try {
//       const res = await fetch("http://localhost:5000/api/auth/signin", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(data),
//       });

//       const result = await res.json();

//       if (!res.ok) {
//         setErrorMessage(result.message || "Signin failed");
//       } else {
//         setResMessage(result.message || "Signin successful");
//         // optionally, store token in localStorage or context

        
//       }
//     } catch (err) {
//       setErrorMessage("Network error. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (showSignupForm) {
//     return (
//       <div className="h-screen px-5 justify-center w-1/4 mx-auto bg-amber-300">
//         <form onSubmit={handleSignup} className="flex flex-col gap-5">
//           <input className="px-2 py-1" type="email" name="email" placeholder="Email" required />
//           <input type="password" name="password" placeholder="Password" required />
//           <input type="text" name="name" placeholder="Name" />
//           <input type="number" name="mobile" placeholder="Mobile Number" required />

//           <select value={selectedState} onChange={handleStateChange} name="state" required>
//             <option value="">Select State</option>
//             {states.map((state) => (
//               <option key={state.name} value={state.name}>
//                 {state.name}
//               </option>
//             ))}
//           </select>

//           <select disabled={!selectedState} name="city" required>
//             <option value="">Select City</option>
//             {cities.map((city) => (
//               <option key={city} value={city}>
//                 {city}
//               </option>
//             ))}
//           </select>

//           <input type="text" name="address" placeholder="Address" required />
//           <input type="number" name="pincode" placeholder="PinCode" required />

//           {errorMessage && <div style={{ color: "red", marginTop: "10px" }}>{errorMessage}</div>}
//           {resMessage && <div style={{ color: "green", marginTop: "10px" }}>{resMessage}</div>}

//           <button type="submit" disabled={loading}>
//             {loading ? "Signing up..." : "SignUp"}
//           </button>

//           <p>Already Have Account?</p>
//           <button type="button" onClick={() => setShowSignupForm(false)}>
//             Signin
//           </button>
//         </form>
//       </div>
//     );
//   }

//   return (
//     <div>
//       <form onSubmit={handleSignin}>
//         <input type="email" name="email" placeholder="Email" required />
//         <input type="password" name="password" placeholder="Password" required />

//         {errorMessage && <div style={{ color: "red", marginTop: "10px" }}>{errorMessage}</div>}
//         {resMessage && <div style={{ color: "green", marginTop: "10px" }}>{resMessage}</div>}

//         <button type="submit" disabled={loading}>
//           {loading ? "Signing in..." : "SignIn"}
//         </button>

//         <p>Don't Have Account?</p>
//         <button type="button" onClick={() => setShowSignupForm(true)}>
//           SignUp
//         </button>
//       </form>
//     </div>
//   );
// }



import { useState } from "react";
import { useNavigate } from "react-router-dom";



export default function Authentication() {
  const states = [
    { name: "Tamil Nadu", cities: ["Chennai", "Coimbatore", "Madurai"] },
    { name: "Karnataka", cities: ["Bangalore", "Mysore", "Mangalore"] },
    { name: "Maharashtra", cities: ["Mumbai", "Pune", "Nagpur"] },
  ];

  const [selectedState, setSelectedState] = useState("");
  const [cities, setCities] = useState([]);
  const [showSignupForm, setShowSignupForm] = useState(true);
  const [resMessage, setResMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;


  const handleStateChange = (e) => {
    const stateName = e.target.value;
    setSelectedState(stateName);
    const state = states.find((s) => s.name === stateName);
    setCities(state ? state.cities : []);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);
    setResMessage(null);

    const data = {
      name: e.target.name.value,
      email: e.target.email.value,
      password: e.target.password.value,
      phone: e.target.mobile.value,
      address_line: e.target.address.value,
      city: e.target.city.value,
      state: e.target.state.value,
      pincode: e.target.pincode.value,
    };

    try {
      const res = await fetch(`${API_URL}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!res.ok || !result.success) {
        setErrorMessage(result.message || "Signup failed");
      } else {
        setResMessage(result.message);
        navigate("/auth");
      }
    } catch (err) {
      setErrorMessage("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);
    setResMessage(null);

    const data = {
      email: e.target.email.value,
      password: e.target.password.value,
    };

    try {
      const res = await fetch(`${API_URL}/auth/signin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!res.ok) {
        setErrorMessage(result.message || "Signin failed");
      } else {
        setResMessage(result.message || "Signin successful");
        localStorage.setItem("access_token", result.access_token);
        navigate("/");
      }
    } catch (err) {
      setErrorMessage("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

 return (
  <div
    className="min-h-screen flex items-center justify-center bg-cover bg-center relative"
    style={{
      backgroundImage:
        "url('https://images.unsplash.com/photo-1600891964599-f61ba0e24092')",
    }}
  >
    {/* Dark overlay */}
    <div className="absolute inset-0 bg-black/60"></div>

    {/* Auth Card */}
    <div className="relative w-full max-w-4xl mx-4 grid md:grid-cols-2 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-xl bg-white/10 border border-white/20">

      {/* LEFT BRAND */}
     <div
  className="hidden md:flex flex-col justify-center items-center text-center p-10 text-white relative bg-cover bg-center"
  style={{
    backgroundImage:
      "url('https://images.unsplash.com/photo-1552566626-52f8b828add9')",
  }}
>
  {/* Dark blue overlay */}
  <div className="absolute inset-0 bg-[#0a2540]/85"></div>

  {/* Content */}
  <div className="relative z-10">
    <h1 className="text-4xl font-extrabold tracking-wide mb-4">
      Mu Family Restaurant
    </h1>

    <p className="text-sm text-blue-200 leading-relaxed max-w-xs">
      Delicious food, seamless ordering, and an unforgettable dining experience.
    </p>

    <div className="mt-6 inline-block px-4 py-1 rounded-full border border-blue-300 text-blue-200 text-sm tracking-wide">
      Since 2024
    </div>
  </div>
</div>



      {/* RIGHT FORM */}
      <div className="card-body bg-base-100/90">

        {/* Tabs */}
        <div className="tabs tabs-boxed justify-center mb-6">
          <a
            className={`tab ${!showSignupForm ? "tab-active" : ""}`}
            onClick={() => setShowSignupForm(false)}
          >
            Sign In
          </a>
          <a
            className={`tab ${showSignupForm ? "tab-active" : ""}`}
            onClick={() => setShowSignupForm(true)}
          >
            Sign Up
          </a>
        </div>

        {/* SIGN IN */}
        {!showSignupForm && (
          <>
            <h2 className="text-2xl font-bold text-center mb-4">
              Welcome Back 
            </h2>

            <form onSubmit={handleSignin} className="space-y-4">

              <input
                type="email"
                name="email"
                placeholder="Email"
                className="input input-bordered w-full"
                required
              />

              <input
                type="password"
                name="password"
                placeholder="Password"
                className="input input-bordered w-full"
                required
              />

              {errorMessage && (
                <div className="alert alert-error text-sm">
                  {errorMessage}
                </div>
              )}

              {resMessage && (
                <div className="alert alert-success text-sm">
                  {resMessage}
                </div>
              )}

              <button
                type="submit"
                className="btn btn-primary w-full"
                disabled={loading}
              >
                {loading && <span className="loading loading-spinner"></span>}
                Sign In
              </button>

            </form>
          </>
        )}

        {/* SIGN UP */}
        {showSignupForm && (
          <>
            <h2 className="text-2xl font-bold text-center mb-4">
              Create Your Account 
            </h2>

            <form onSubmit={handleSignup} className="space-y-4">

              <input
                type="email"
                name="email"
                placeholder="Email"
                className="input input-bordered w-full"
                required
              />

              <input
                type="password"
                name="password"
                placeholder="Password"
                className="input input-bordered w-full"
                required
              />

              <input
                type="text"
                name="name"
                placeholder="Full Name"
                className="input input-bordered w-full"
              />

              <input
                type="number"
                name="mobile"
                placeholder="Mobile Number"
                className="input input-bordered w-full"
                required
              />

              <select
                name="state"
                value={selectedState}
                onChange={handleStateChange}
                className="select select-bordered w-full"
                required
              >
                <option value="">Select State</option>
                {states.map((state) => (
                  <option key={state.name} value={state.name}>
                    {state.name}
                  </option>
                ))}
              </select>

              <select
                name="city"
                className="select select-bordered w-full"
                disabled={!selectedState}
                required
              >
                <option value="">Select City</option>
                {cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>

              <input
                type="text"
                name="address"
                placeholder="Address"
                className="input input-bordered w-full"
                required
              />

              <input
                type="number"
                name="pincode"
                placeholder="Pincode"
                className="input input-bordered w-full"
                required
              />

              {errorMessage && (
                <div className="alert alert-error text-sm">
                  {errorMessage}
                </div>
              )}

              {resMessage && (
                <div className="alert alert-success text-sm">
                  {resMessage}
                </div>
              )}

              <button
                type="submit"
                className="btn btn-primary w-full"
                disabled={loading}
              >
                {loading && <span className="loading loading-spinner"></span>}
                Sign Up
              </button>

            </form>
          </>
        )}

      </div>
    </div>
  </div>
);

}

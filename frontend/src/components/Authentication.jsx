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
//         localStorage.setItem("access_token", result.access_token);
//         console.log(result.access_token);
        
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
      const res = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!res.ok || !result.success) {
        setErrorMessage(result.message || "Signup failed");
      } else {
        setResMessage(result.message);
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
      const res = await fetch("http://localhost:5000/api/auth/signin", {
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
      }
    } catch (err) {
      setErrorMessage("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-purple-100 via-pink-50 to-yellow-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 md:p-8">
        {showSignupForm ? (
          <>
            <h2 className="text-2xl font-bold text-purple-700 text-center mb-6">Sign Up</h2>
            <form onSubmit={handleSignup} className="flex flex-col gap-4">
              <input
                type="email"
                name="email"
                placeholder="Email"
                required
                className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                required
                className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <input
                type="text"
                name="name"
                placeholder="Name"
                className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <input
                type="number"
                name="mobile"
                placeholder="Mobile Number"
                required
                className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <select
                value={selectedState}
                onChange={handleStateChange}
                name="state"
                required
                className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Select State</option>
                {states.map((state) => (
                  <option key={state.name} value={state.name}>
                    {state.name}
                  </option>
                ))}
              </select>
              <select
                disabled={!selectedState}
                name="city"
                required
                className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
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
                required
                className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <input
                type="number"
                name="pincode"
                placeholder="PinCode"
                required
                className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />

              {errorMessage && <div className="text-red-600 text-sm">{errorMessage}</div>}
              {resMessage && <div className="text-green-600 text-sm">{resMessage}</div>}

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-2 rounded-lg text-white font-semibold transition-colors ${
                  loading ? "bg-purple-300 cursor-not-allowed" : "bg-purple-600 hover:bg-purple-700"
                }`}
              >
                {loading ? "Signing up..." : "Sign Up"}
              </button>

              <p className="text-center text-gray-500 mt-2">Already have an account?</p>
              <button
                type="button"
                onClick={() => setShowSignupForm(false)}
                className="w-full py-2 border border-purple-600 rounded-lg text-purple-600 hover:bg-purple-50 transition-colors"
              >
                Sign In
              </button>
            </form>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-purple-700 text-center mb-6">Sign In</h2>
            <form onSubmit={handleSignin} className="flex flex-col gap-4">
              <input
                type="email"
                name="email"
                placeholder="Email"
                required
                className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                required
                className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />

              {errorMessage && <div className="text-red-600 text-sm">{errorMessage}</div>}
              {resMessage && <div className="text-green-600 text-sm">{resMessage}</div>}

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-2 rounded-lg text-white font-semibold transition-colors ${
                  loading ? "bg-purple-300 cursor-not-allowed" : "bg-purple-600 hover:bg-purple-700"
                }`}
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>

              <p className="text-center text-gray-500 mt-2">Don't have an account?</p>
              <button
                type="button"
                onClick={() => setShowSignupForm(true)}
                className="w-full py-2 border border-purple-600 rounded-lg text-purple-600 hover:bg-purple-50 transition-colors"
              >
                Sign Up
              </button>
            </form>
          </>
        )}
    </div>
    </div>
  );
}

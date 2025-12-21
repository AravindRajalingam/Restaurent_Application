import './App.css'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Authentication from './components/Authentication.jsx';
import Home from './components/Home.jsx';
import MenuItems from './components/MenuItems.jsx';
import Cart from './components/Cart.jsx';
import Layout from './components/Layout.jsx';
import About from './components/About.jsx';
import Contact from './components/Contact.jsx';
import Checkout from './components/Checkout.jsx';
import PaymentSuccess from './components/PaymentSuccess.jsx';
import Myorders from './components/MyOrders.jsx';
import AddMenuItem from './components/Admin/AddMenuItem.jsx';
import SelectedItems from './components/SelectedItems.jsx';
import { useEffect } from 'react';
import { getAccessToken } from './components/Utils/getAccessToken.jsx';
import AllOrders from './components/Admin/AllOrders.jsx';
function App() {

  const API_URL = import.meta.env.VITE_API_URL;

  async function refreshToken() {
    
    const expiry = localStorage.getItem("token_expiry");
    console.log(expiry);
        
    
    const now = Date.now();

    if (!expiry || now >= expiry) {
      const refresh_token = localStorage.getItem("refresh_token");
      if (!refresh_token) return;

      const res = await fetch(`${API_URL}/auth/refresh-token`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh_token }),
      });

      const result = await res.json();
      console.log(result);
      
      
      if (result.success) {
        localStorage.setItem("access_token", result.access_token);
        localStorage.setItem("refresh_token", result.refresh_token);
        localStorage.setItem("token_expiry", Date.now() + result.expires_in * 1000);
        return result.access_token;
      } else {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("token_expiry");
        return null;
      }
    }

    return localStorage.getItem("access_token");
  }

  useEffect(() => {
    async function refresh() {      
      await refreshToken()
    }
    refresh()
  }, []);


  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/auth" element={<Authentication />} />

          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/item-menu" element={<MenuItems />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/about-us" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/payment-success" element={<PaymentSuccess />} />
            <Route path="/my-orders" element={<Myorders />} />
            <Route path="/add" element={<AddMenuItem />} />
            <Route path='/item/:item_id' element={<SelectedItems />} />
            <Route path='/all-orders' element={<AllOrders />} />

          </Route>

        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App

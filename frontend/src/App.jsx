import { useState } from 'react'
import './App.css'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Authentication from './components/Authentication.jsx';
import PaymentButton from './components/PaymentButton.jsx';
import Home from './components/Home.jsx';
import MenuItems from './components/MenuItems.jsx';
import Cart from './components/Cart.jsx';

function App() {

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/auth" element={<Authentication />} />  
          <Route path="/pay" element={<PaymentButton />} />
          <Route path="/" element={<Home />} />    
          <Route path="/our-menu" element={<MenuItems/>}/>
          <Route path="/cart" element={<Cart/>} />      
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App

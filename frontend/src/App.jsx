import './App.css'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Authentication from './components/Authentication.jsx';
import PaymentButton from './components/Utils/PaymentButton.jsx';
import Home from './components/Home.jsx';
import MenuItems from './components/MenuItems.jsx';
import Cart from './components/Cart.jsx';
import Layout from './components/Layout.jsx';
import About from './components/About.jsx';
import Contact from './components/Contact.jsx';

function App() {

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/auth" element={<Authentication />} />
          <Route element={<Layout />}>
            <Route path="/pay" element={<PaymentButton />} />
            <Route path="/" element={<Home />} />
            <Route path="/item-menu" element={<MenuItems />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/about-us" element={<About/>} />
            <Route path="/contact" element={<Contact />} />
          </Route>

        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App

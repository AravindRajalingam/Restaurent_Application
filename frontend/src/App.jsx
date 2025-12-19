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
import AddCategory from './components/Admin/AddCategory.jsx';
import AddMenuItem from './components/Admin/AddMenuItem.jsx';

function App() {

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/auth" element={<Authentication />} />

          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/item-menu" element={<MenuItems />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/about-us" element={<About/>} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/add-category" element={<AddCategory />} />
            <Route path="/add-menu-item" element={<AddMenuItem />} />
          </Route>

        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App

import { useState } from 'react'
import './App.css'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Authentication from './components/Authentication.jsx';

function App() {

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Authentication />} />          
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App

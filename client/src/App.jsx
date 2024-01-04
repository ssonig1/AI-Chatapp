import { useState } from 'react'
import { BrowserRouter as Router, Route, Routes, Navigate} from 'react-router-dom';
import './App.css'
import Login from './pages/login/Login'
import Room from './pages/room/Room'
function App() {
  
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login/>} />
        <Route path="/room" element={<Room/>} />
        </Routes>
    </Router>
  )
}

export default App

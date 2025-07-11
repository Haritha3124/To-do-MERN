import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import OAuthSuccess from './components/OAuthSuccess';
import Navbar from './Navbar';

function App() {
  // const isAuthenticated = !!localStorage.getItem('token');

  return (
    <div className='global-bg'>
      <Router className="container">
        <Navbar/>
        <Routes>

          <Route path="/" element={<Register/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="/home" element={<Home/>}/>
          <Route path='/oauth-success' element={<OAuthSuccess/>} />

          <Route path="*" element={<h1>Not found</h1>}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;

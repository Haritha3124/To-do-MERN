import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';

function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/login');
  };

  const navbarStyle = {
    backgroundColor: '#2c3e50',
    padding: '12px 50px',
    color: '#fff',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    zIndex: 1000,
  };

  const brandStyle = {
    fontSize: '1.8rem',
    fontWeight: 'bold',
    textDecoration: 'none',
    color: '#fff',
  };

  const linkStyle = {
    color: '#fff',
    marginLeft: '16px',
    textDecoration: 'none',
    fontWeight: '500',
  };

  return (
    <nav style={navbarStyle} className="navbar-fixed">
      <Link to="/home" style={brandStyle}>TodoApp</Link>
      <div>
        {!user ? (
          <>
            <Link to="/login" style={linkStyle}>Login</Link>
            <Link to="/" style={linkStyle}>Register</Link>
          </>
        ) : (
          <button onClick={handleLogout} style={{ ...linkStyle, border: 'none', background: 'transparent', cursor: 'pointer' }}>
            <FaUserCircle size={20} style={{ marginRight: '6px' }} />
            Logout ({user.name})
          </button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;

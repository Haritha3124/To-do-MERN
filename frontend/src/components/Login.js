import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await axios.post('/api/users/login', formData);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data));
      navigate('/home'); 
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  const handleOAuth = (provider) => {
    window.location.href = `/auth/${provider}`;
  };

  return (
    <div className="container login-page d-flex align-items-center justify-content-center min-vh-100 px-3 bg-light">
      <div className="login-card card shadow p-4 rounded-4 w-100" style={{ maxWidth: '420px' }}>
        <h2 className="text-center fw-bold text-dark mb-4">Login</h2>

        {error && (
          <div className="alert alert-danger small py-2">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email address</label>
            <input
              type="email"
              className="form-control custom-input"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="you@example.com"
            />
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              className="form-control custom-input"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter password"
            />
          </div>

          <button type="submit" className="btn btn-primary w-100 fw-semibold custom-button">
            Login
          </button>
        </form>

        <div className="text-center text-muted small mt-4">or sign in with</div>

        <div className="d-grid gap-2 mt-3">
          <button onClick={() => handleOAuth('google')} className="btn btn-outline-danger custom-oauth-btn">
            Sign in with Google
          </button>
          <button onClick={() => handleOAuth('github')} className="btn btn-outline-dark custom-oauth-btn">
            Sign in with GitHub
          </button>
        </div>
      </div>
    </div>
  );

}

export default Login;
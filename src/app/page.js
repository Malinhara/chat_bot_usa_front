"use client"


import { useState } from 'react';
import './login.css'; // Import the CSS file

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error] = useState(null);


  const handleLogin = (e) => {
    e.preventDefault();

  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient">
      <div className="card">
        <h2>Login</h2>

        {error && <p className="error-message">{error}</p>}

        <form onSubmit={handleLogin}>
          <div>
            <label htmlFor="email" className="form-label">Email</label>
            <input
              type="email"
              id="email"
              className="form-input"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              id="password"
              className="form-input"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <br></br>

          <button type="submit" className="btn-submit">Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login;

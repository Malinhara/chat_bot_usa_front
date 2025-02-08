"use client"

import { useState } from 'react';
import './login.css'; // Import the CSS file

import { useRouter } from 'next/navigation';  // Correct import for Next.js 13+ app directory

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [setLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);  // To toggle between login and register forms

  const router = useRouter();  // Correct usage in Next.js 13+ app directory

  const handleLogin = async (e) => {
    e.preventDefault();

    // Reset any previous error
    setError(null);
    setLoading(true);

    try {
      const response = await fetch('http://localhost:8100/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle error response
        throw new Error(data.detail || 'Login failed');
      }

      // Handle successful login (for example, redirect the user)
      router.push('/main');  // Corrected: Use `router.push()` for navigation
      console.log('Login successful:', data);
      // Redirect or save the auth token here

    } catch (err) {
      setError(err.message); // Set error message to display
    } finally {
      setLoading(false); // Stop loading state
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    // Reset any previous error
    setError(null);
    setLoading(true);

    try {
      const response = await fetch('http://localhost:8100/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle error response
        throw new Error(data.detail || 'Registration failed');
      }

      // Handle successful registration (for example, redirect the user)
      router.push('/main');
      console.log('Registration successful:', data);
      // Redirect or save the auth token here

    } catch (err) {
      setError(err.message); // Set error message to display
    } finally {
      setLoading(false); // Stop loading state
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient">
      <div className="card">
        <h2>{isRegistering ? 'Register' : 'Login'}</h2>

        {error && <p className="error-message">{error}</p>}

        <form onSubmit={isRegistering ? handleRegister : handleLogin}>
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

          <button type="submit" className="btn-submit">{isRegistering ? 'Register' : 'Login'}</button>
        </form>

        <br></br>

        <button
          className="btn-toggle"
          onClick={() => setIsRegistering(!isRegistering)}
        >
          {isRegistering ? 'Already have an account? Login' : 'Create an account'}
        </button>
      </div>
    </div>
  );
};

export default Login;

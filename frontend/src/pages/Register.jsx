import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    alias: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      await register(
        formData.username,
        formData.email,
        formData.password,
        formData.alias
      );
      navigate('/login', { state: { message: 'Registration successful! Please log in.' } });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-300">
      <div className="card w-full max-w-md bg-white shadow-2xl">
        <div className="card-body">
          <h2 className="text-3xl font-bold text-center text-black">
            Create Account
          </h2>

          {error && (
            <div className="alert alert-error" role="alert">
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="fieldset">
              <label className="fieldset-legend w-full font-semibold text-sm text-gray-400">Username</label>
              <input
                type="text"
                placeholder="Enter your username"
                className="input w-full  bg-white text-black border-black focus:outline-gray-700"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>

            <div className="fieldset">
              <label className="fieldset-legend w-full font-semibold text-sm text-gray-400">Alias</label>
              <input
                type="text"
                placeholder="Enter your alias"
                className="input w-full bg-white text-black border-black focus:outline-gray-700"
                name="alias"
                value={formData.alias}
                onChange={handleChange}
                required
              />
            </div>

            <div className="fieldset">
              <label className="fieldset-legend w-full  font-semibold text-sm text-gray-400">Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                className="input w-full bg-white text-black border-black focus:outline-gray-700"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="fieldset">
              <label className="fieldset-legend w-full  font-semibold text-sm text-gray-400">Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                className="input w-full text-black bg-white border-black focus:outline-gray-700"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="fieldset">
              <label className="fieldset-legend w-full font-semibold text-sm text-gray-400">Confirm Password</label>
              <input
                type="password"
                placeholder="Confirm your password"
                className="input w-full bg-white text-black border-black focus:outline-gray-700"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>

            <button
              type="submit"
              className="btn w-full bg-gray-700 text-white my-12"
              disabled={loading}
            >
              Register
            </button>
          </form>

          <p className="text-center text-gray-600">
            Already have an account?{' '}
            <a href="/login" className="link text-gray-600 font-semibold">
              Log in here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

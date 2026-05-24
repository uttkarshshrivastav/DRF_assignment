import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  useEffect(()=>{
      if(isAuthenticated){
        navigate('/dashboard')
      }

  }, [isAuthenticated, navigate])

  const successMessage = location.state?.message;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(formData.email, formData.password);
      navigate('/dashboard');
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
          <h2 className="text-3xl font-bold text-black text-center">
            Hello
          </h2>

          {successMessage && (
            <div className="alert alert-success" role="status">
              <span>{successMessage}</span>
            </div>
          )}

          {error && (
            <div className="alert alert-error" role="alert">
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="fieldset">
              <label className="fieldset-legend font-semibold text-sm text-gray-400">Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                className="input w-full bg-white border-black text-black focus:outline-gray-700"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-control">
              <label className="fieldset-legend font-semibold text-sm text-gray-400">Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                className="input w-full bg-white border-black text-black focus:outline-gray-700"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <button
              type="submit"
              className="btn bg-gray-700 w-full text-white my-12"
              disabled={loading}
            >
              Log In
            </button>
          </form>


          <p className="text-center my-0 text-gray-400">
            New User?{' '}
            <a href="/register" className="link text-gray-600 font-semibold">
              Register
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

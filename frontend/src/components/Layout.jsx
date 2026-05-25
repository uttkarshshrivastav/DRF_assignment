import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import client from '../api/client';

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showProf, setShowProf] = useState(false);

  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    key: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await client.post('/make-admin/', formData);
      console.log(response.data)
      setShowProf(false)
      setFormData({key:''})
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid Key');
    }
  };


  const handleLogout = () => {
    logout();
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleProfileClick = () => {
    setShowProf(true)
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="navbar bg-gray-700 text-white shadow-lg sticky top-0 z-50">
        <div className="flex-1">
          <a className="btn btn-ghost text-xl font-bold">
            Studio System
          </a>
        </div>
        <div className="flex-none gap-4">
          <div className="dropdown dropdown-end">
            <div tabIndex={0} className="avatar placeholder cursor-pointer">
              <div className="bg-gray-500 text-white rounded-full w-10 flex items-center justify-center font-bold">
                {user?.alias?.charAt(0).toUpperCase() || '?'}
              </div>
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content z-1 menu p-2 shadow bg-base-100 rounded-box w-52"
            >
              <li>
                <a className="justify-between" onClick={handleProfileClick}>
                  {user?.username}
                  <span className="badge">Profile</span>
                </a>
              </li>
              <li>
                <button onClick={handleLogout}>Logout</button>
              </li>
            </ul>
          </div>
        </div>
      </div>


      {showProf && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-md bg-white rounded-xl p-6 shadow-xl transform transition-all">
            <h3 className="font-bold text-lg mb-4 text-gray-900">Who are you really ?</h3>

            {error && (
              <div className="bg-red-50 text-red-700 border border-red-200 p-3 rounded-lg mb-4 text-sm" role="alert">
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">

              <div className="flex flex-col gap-1.5">
                <input
                  type="password"
                  placeholder="Enter key"
                  className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 text-sm"
                  name="key"
                  value={formData.key}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={()=>{setShowProf(false)}}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-gray-700 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50"
                >
                  Verify
                </button>
              </div>
            </form>
          </div>
        </div>)}

      <main className="grow">{children}</main>

    </div>


  );
}

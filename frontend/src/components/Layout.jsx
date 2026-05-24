import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    navigate('/login');
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
              className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
            >
              <li>
                <a className="justify-between">
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

      <main className="flex-grow">{children}</main>
    </div>
  );
}

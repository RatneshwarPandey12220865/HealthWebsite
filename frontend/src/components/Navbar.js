import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-xl font-bold">
            HealthCare System
          </Link>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <span>Welcome, {user?.name}</span>
                {user?.role === 'admin' && (
                  <Link to="/admin" className="hover:text-blue-200">
                    Dashboard
                  </Link>
                )}
                {user?.role === 'doctor' && (
                  <Link to="/doctor" className="hover:text-blue-200">
                    Dashboard
                  </Link>
                )}
                {user?.role === 'patient' && (
                  <Link to="/patient" className="hover:text-blue-200">
                    Dashboard
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="bg-blue-700 hover:bg-blue-800 px-3 py-1 rounded"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-blue-200">
                  Login
                </Link>
                <Link to="/register" className="hover:text-blue-200">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
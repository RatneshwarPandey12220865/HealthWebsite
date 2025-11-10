import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-blue-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Your Health, Our Priority
          </h1>
          <p className="text-xl mb-8">
            Book appointments with qualified doctors easily and efficiently
          </p>
          {!isAuthenticated ? (
            <div className="space-x-4">
              <Link
                to="/register"
                className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100"
              >
                Get Started
              </Link>
              <Link
                to="/login"
                className="border border-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700"
              >
                Login
              </Link>
            </div>
          ) : (
            <div className="text-center">
              <h2 className="text-2xl mb-4">Welcome back, {user?.name}!</h2>
              {user?.role === 'admin' && (
                <Link
                  to="/admin"
                  className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100"
                >
                  Go to Dashboard
                </Link>
              )}
              {user?.role === 'doctor' && (
                <Link
                  to="/doctor"
                  className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100"
                >
                  Go to Dashboard
                </Link>
              )}
              {user?.role === 'patient' && (
                <Link
                  to="/patient"
                  className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100"
                >
                  Find Doctors
                </Link>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Us?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🏥</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Qualified Doctors</h3>
              <p className="text-gray-600">
                Access to experienced and certified medical professionals
              </p>
            </div>
            <div className="text-center p-6">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📅</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Easy Booking</h3>
              <p className="text-gray-600">
                Simple and quick appointment booking process
              </p>
            </div>
            <div className="text-center p-6">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⏰</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">24/7 Support</h3>
              <p className="text-gray-600">
                Round-the-clock customer support for your needs
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
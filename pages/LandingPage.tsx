
import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-blue-100 text-center px-4">
      <div className="max-w-4xl">
        <h1 className="text-5xl md:text-7xl font-extrabold text-secondary tracking-tight">
          Welcome to <span className="text-primary">InventoFlow</span>
        </h1>
        <p className="mt-4 text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
          The smart, sleek, and simple solution to manage your inventory. Get real-time insights, track stock levels, and streamline your operations effortlessly.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/signup"
            className="w-full sm:w-auto px-8 py-3 bg-primary text-white font-semibold rounded-lg shadow-md hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary-focus focus:ring-opacity-75 transition-transform transform hover:scale-105"
          >
            Get Started for Free
          </Link>
          <Link
            to="/login"
            className="w-full sm:w-auto px-8 py-3 bg-white text-primary font-semibold rounded-lg shadow-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-opacity-75 transition-transform transform hover:scale-105"
          >
            Login to Your Account
          </Link>
        </div>
        <div className="mt-16">
          <img 
            src="https://picsum.photos/seed/inventory/1200/600" 
            alt="Inventory Dashboard Preview" 
            className="rounded-xl shadow-2xl ring-1 ring-gray-900/10"
          />
        </div>
      </div>
    </div>
  );
};

export default LandingPage;

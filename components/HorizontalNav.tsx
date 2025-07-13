
import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { LogoutIcon, ChevronDownIcon } from './Icons';
import { Link } from 'react-router-dom';

const HorizontalNav: React.FC = () => {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-end px-4 sm:px-6 lg:px-8">
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <img
            src={user?.avatar}
            alt="User Avatar"
            className="h-10 w-10 rounded-full object-cover border-2 border-gray-300"
          />
          <div className="hidden md:flex flex-col items-start">
            <span className="font-semibold text-sm text-gray-700">{user?.name}</span>
            <span className="text-xs text-gray-500">{user?.email}</span>
          </div>
          <ChevronDownIcon className={`h-5 w-5 text-gray-500 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
        </button>
        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-xl z-50 py-1 border border-gray-200">
            <button
              onClick={logout}
              className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-primary hover:text-white transition-colors"
            >
              <LogoutIcon className="h-5 w-5 mr-2" />
              <span>Logout</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default HorizontalNav;

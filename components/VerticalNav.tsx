
import React from 'react';
import { NavLink } from 'react-router-dom';
import { DashboardIcon, InventoryIcon, AddItemIcon } from './Icons';

const navItems = [
  { to: 'dashboard', icon: DashboardIcon, text: 'Dashboard' },
  { to: 'inventory', icon: InventoryIcon, text: 'Inventory' },
  { to: 'add-item', icon: AddItemIcon, text: 'Add Item' },
];

const VerticalNav: React.FC = () => {
  const baseClasses = "flex items-center px-4 py-3 text-gray-200 hover:bg-secondary-light hover:text-white transition-colors duration-200";
  const activeClasses = "bg-primary text-white";

  return (
    <nav className="hidden md:flex flex-col w-64 bg-secondary text-white">
      <div className="flex items-center justify-center h-20 border-b border-gray-700">
        <h1 className="text-2xl font-bold text-white tracking-wider">InventoFlow</h1>
      </div>
      <div className="flex-1 overflow-y-auto">
        <ul>
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={`/app/${item.to}`}
                className={({ isActive }) => `${baseClasses} ${isActive ? activeClasses : ''}`}
              >
                <item.icon className="h-6 w-6 mr-3" />
                <span>{item.text}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default VerticalNav;

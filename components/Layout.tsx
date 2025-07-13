
import React from 'react';
import VerticalNav from './VerticalNav';
import HorizontalNav from './HorizontalNav';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen bg-light">
      <VerticalNav />
      <div className="flex-1 flex flex-col overflow-hidden">
        <HorizontalNav />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-light p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;

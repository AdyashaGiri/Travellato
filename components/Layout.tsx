import React from 'react';
import Navbar from './Navbar';

const Layout: React.FC<{ children: React.ReactNode; currentPath: string }> = ({ children, currentPath }) => {
  return (
    <div className="relative min-h-screen">
      <ul className="animated-bg">
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
      </ul>
      
      <Navbar currentPath={currentPath} />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 relative z-10">
        {children}
      </main>

      <footer className="text-center py-6 text-sm text-gray-400 no-print relative z-10">
        <p>Powered by AI. Your next adventure awaits with Travelato.</p>
      </footer>
    </div>
  );
};

export default Layout;
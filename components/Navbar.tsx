import React from 'react';
import { PlaneIcon } from './Icons';

const NavLink: React.FC<{ href: string; currentPath: string; children: React.ReactNode }> = ({ href, currentPath, children }) => {
    const isActive = href === currentPath;

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        if (window.location.hash !== href) {
            window.location.hash = href;
        }
    };

    return (
        <a
            href={href}
            onClick={handleClick}
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive
                    ? 'bg-white/10 text-white'
                    : 'text-gray-300 hover:bg-white/5 hover:text-white'
            }`}
        >
            {children}
        </a>
    );
};


const Navbar: React.FC<{ currentPath: string }> = ({ currentPath }) => {

    const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        if (window.location.hash !== '#') {
            window.location.hash = '#';
        }
    };

    return (
        <header className="bg-black/20 backdrop-blur-lg shadow-lg sticky top-0 z-20 no-print">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center space-x-3">
                        <a href="#" onClick={handleLogoClick} className="flex items-center space-x-3">
                            <div className="bg-gradient-to-r from-[var(--accent-gradient-from)] to-[var(--accent-gradient-to)] p-2 rounded-lg">
                                <PlaneIcon className="w-6 h-6 text-white" />
                            </div>
                            <h1 className="text-2xl font-bold text-white">Travelato</h1>
                        </a>
                    </div>
                    <nav className="flex items-center space-x-4">
                        <NavLink href="#" currentPath={currentPath}>Itinerary Planner</NavLink>
                        <NavLink href="#/saved" currentPath={currentPath}>Saved Trips</NavLink>
                        <NavLink href="#/converter" currentPath={currentPath}>Currency Converter</NavLink>
                    </nav>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
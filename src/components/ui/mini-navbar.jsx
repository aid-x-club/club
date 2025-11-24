"use client";

import React, { useState, useEffect, useRef } from 'react';

const AnimatedNavLink = ({ href, children, onClick, isActive }) => {
  const defaultTextColor = isActive ? 'text-white' : 'text-gray-300';
  const hoverTextColor = 'text-white';
  const textSizeClass = 'text-base font-medium';

  return (
    <button 
      onClick={onClick}
      className={`group relative inline-block h-6 overflow-hidden ${textSizeClass} cursor-pointer`}
      style={{ width: 'fit-content' }}
    >
      <div className="flex flex-col transition-transform duration-300 ease-out transform group-hover:-translate-y-1/2">
        <span className={`${defaultTextColor} whitespace-nowrap flex items-center justify-center h-6`}>{children}</span>
        <span className={`${hoverTextColor} whitespace-nowrap flex items-center justify-center h-6`}>{children}</span>
      </div>
    </button>
  );
};

export function Navbar({ activeTab, setActiveTab, onLogout }) {
  const [isOpen, setIsOpen] = useState(false);
  const [headerShapeClass, setHeaderShapeClass] = useState('rounded-full');
  const shapeTimeoutRef = useRef(null);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    if (shapeTimeoutRef.current) {
      clearTimeout(shapeTimeoutRef.current);
    }

    if (isOpen) {
      setHeaderShapeClass('rounded-xl');
    } else {
      shapeTimeoutRef.current = setTimeout(() => {
        setHeaderShapeClass('rounded-full');
      }, 300);
    }

    return () => {
      if (shapeTimeoutRef.current) {
        clearTimeout(shapeTimeoutRef.current);
      }
    };
  }, [isOpen]);

  const logoElement = (
    <div className="relative w-15 h-10 flex items-center justify-center">
      <img src="/images/s/club_logo.png" alt="AID-X Club" className="w-full h-full object-contain" />
    </div>
  );

  const navLinksData = [
    { label: 'Overview', key: 'overview' },
    { label: 'Projects', key: 'projects' },
    { label: 'Events', key: 'events' },
    { label: 'Profile', key: 'profile' },
  ];

  
  
  return (
    <header className={`fixed top-6 left-1/2 transform -translate-x-1/2 z-20
                       flex flex-col items-center
                       pl-10 pr-10 py-3 backdrop-blur-sm
                       ${headerShapeClass}
                       border border-[#333] bg-[#1f1f1f57]
                       w-[calc(100%-1rem)] sm:w-auto min-w-[650px]
                       transition-[border-radius] duration-0 ease-in-out`}>

      <div className="flex items-center justify-between w-full gap-x-6 sm:gap-x-8">
        <div className="flex items-center flex-shrink-0">
           {logoElement}
        </div>

        <nav className="hidden sm:flex items-center flex-1 justify-center space-x-6 sm:space-x-8">
          {navLinksData.map((link) => (
            <AnimatedNavLink 
              key={link.key} 
              onClick={() => setActiveTab && setActiveTab(link.key)}
              isActive={activeTab === link.key}
            >
              {link.label}
            </AnimatedNavLink>
          ))}
        </nav>

        
        <button className="sm:hidden flex items-center justify-center w-10 h-10 text-gray-300 focus:outline-none" onClick={toggleMenu} aria-label={isOpen ? 'Close Menu' : 'Open Menu'}>
          {isOpen ? (
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          ) : (
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
          )}
        </button>
      </div>

      <div className={`sm:hidden flex flex-col items-center w-full transition-all ease-in-out duration-300 overflow-hidden
                       ${isOpen ? 'max-h-[1000px] opacity-100 pt-6' : 'max-h-0 opacity-0 pt-0 pointer-events-none'}`}>
        <nav className="flex flex-col items-center space-y-6 text-lg w-full">
          {navLinksData.map((link) => (
            <button 
              key={link.key} 
              onClick={() => setActiveTab && setActiveTab(link.key)}
              className={`text-gray-300 hover:text-white transition-colors w-full text-center font-medium whitespace-nowrap ${activeTab === link.key ? 'text-white font-semibold' : ''}`}
            >
              {link.label}
            </button>
          ))}
        </nav>
              </div>
    </header>
  );
}

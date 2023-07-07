import React, { useState } from 'react';

import Logo from '@/components/logo';
import Burger from '@/components/burger';
import Link from 'next/link';

const NavList = ({ className }) => (
  <navigation className={className}>
    <ul className="flex flex-col h-full justify-center text-2xl md:flex-row md:text-xl md:justify-between md:h-auto">
      <li className="md:px-4">
        <Link href="/projects" className="block py-2 md:p-0">
          Projects
        </Link>
      </li>
      <li className="md:px-4">
        <Link href="/about-us" className="block py-2 md:p-0">
          About us
        </Link>
      </li>
      <li className="md:px-4">
        <Link href="/services" className="block py-2 md:p-0">
          Services
        </Link>
      </li>
      <li className="md:pl-4">
        <Link href="/contact" className="block py-2 md:p-0">
          Contact
        </Link>
      </li>
    </ul>
  </navigation>
);

export default function Navigation() {
  const [activeMobileNav, setActiveMobileNav] = useState(false);

  const handleClick = () => {
    setActiveMobileNav(!activeMobileNav);
  };

  return (
    <header className="fixed top-0 flex z-30 justify-between w-full p-5 md:p-7 lg:p-10 text-white">
      <Logo />
      <Burger className="md:hidden z-50 relative" onClick={handleClick} />
      {activeMobileNav && (
        <div className="bg-white absolute inset-0 flex align-center justify-center">
          <NavList className="text-center" />
        </div>
      )}
      <NavList className="hidden md:flex items-center" />
    </header>
  );
}

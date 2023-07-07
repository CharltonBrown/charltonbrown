import React, { useState } from 'react';

import Logo from '@/components/logo';
import Burger from '@/components/burger';
import Link from 'next/link';

const NavList = ({ className }) => (
  <navigation className={className}>
    <ul className="flex flex-col h-full justify-center text-2xl md:flex-row md:text-xl md:justify-between">
      <li className="md:px-4">
        <Link href="/projects" className="block py-2">
          Projects
        </Link>
      </li>
      <li className="md:px-4">
        <Link href="/about-us" className="block py-2">
          About us
        </Link>
      </li>
      <li className="md:px-4">
        <Link href="/services" className="block py-2">
          Services
        </Link>
      </li>
      <li className="md:pl-4">
        <Link href="/contact" className="block py-2">
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
    <header className="flex justify-between w-full p-5 md:p-7">
      <Logo />
      <Burger className="md:hidden z-50 relative" onClick={handleClick} />
      {activeMobileNav && (
        <div className="bg-white absolute inset-0 flex align-center justify-center">
          <NavList className="text-center" />
        </div>
      )}
      <NavList className="hidden md:flex align-center" />
    </header>
  );
}

import React, { useState } from 'react';
import Link from 'next/link';

import Logo from '@/components/logo';
import Burger from '@/components/burger';

const NavList = ({ className, navigation }) => (
  <nav className={className}>
    <ul className="flex flex-col h-full justify-center text-2xl md:flex-row md:text-xl md:justify-between md:h-auto">
      {navigation.map((link) => (
        <li className="md:px-4" key={link.id}>
          <Link href={`/${link.href}`} className="block py-2 md:p-0">
            {link.text}
          </Link>
        </li>
      ))}
    </ul>
  </nav>
);

export default function Navigation({ navigation }) {
  const [activeMobileNav, setActiveMobileNav] = useState(false);

  const handleClick = () => {
    setActiveMobileNav(!activeMobileNav);
  };

  return (
    <header className="fixed top-0 flex z-100 justify-between w-full p-5 md:p-7 lg:p-10 text-white">
      <Logo />
      <Burger className="md:hidden z-50 relative" onClick={handleClick} />
      {activeMobileNav && (
        <div className="bg-white absolute inset-0 flex align-center justify-center">
          <NavList navigation={navigation} className="text-center" />
        </div>
      )}
      <NavList
        navigation={navigation}
        className="hidden md:flex items-center"
      />
    </header>
  );
}

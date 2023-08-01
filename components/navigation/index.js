import React, { useState } from 'react';
import Link from 'next/link';
import { useContextSelector } from 'use-context-selector';
import clsx from 'clsx';

import Logo from '@/components/logo';
import Burger from '@/components/burger';
import navColorContext from '@/lib/context/navColorContext';

const NavList = ({ className, navigation }) => (
  <nav className={className}>
    <ul className="flex flex-col h-full justify-center text-2xl md:flex-row md:text-xl md:justify-between md:h-auto">
      {navigation.map((link) => (
        <li className="md:px-3 last:md:pr-0" key={link.id}>
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
  const navTheme = useContextSelector(navColorContext, (v) => v[0].theme);

  const handleClick = () => {
    setActiveMobileNav(!activeMobileNav);
  };

  return (
    <header
      className={clsx(
        navTheme === 'light' ? 'text-white' : 'text-black',
        'fixed top-0 flex z-50 justify-between w-full p-5 md:p-7 lg:p-10 transition',
      )}
    >
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

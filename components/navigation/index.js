import React, { useState } from 'react';
import Link from 'next/link';
import { useContextSelector } from 'use-context-selector';
import clsx from 'clsx';
import { usePathname } from 'next/navigation';

import Logo from '@/components/logo';
import Burger from '@/components/burger';
import Container from '@/components/container';
import navColorContext from '@/lib/context/navColorContext';

const NavList = ({ className, navigation, navTheme }) => {
  const pathname = usePathname();
  const isHome = pathname === '/';

  return (
    <nav className={className}>
      <ul className="flex flex-col h-full justify-center text-2xl md:flex-row md:text-lg md:justify-between md:h-auto">
        {navigation.map((link) => {
          const isActive = pathname.startsWith(`/${link.href}`);
          return (
            <li className="md:px-3 last:md:pr-0" key={link.id}>
              <Link
                href={`/${link.href}`}
                className={clsx(
                  'block py-2 md:p-0 transition',
                  navTheme === 'light' &&
                    !isHome &&
                    'text-white hover:text-white focus:text-white',
                  navTheme === 'dark' &&
                    !isHome &&
                    'text-black hover:text-black focus:text-black',
                  !isActive && !isHome && 'text-silver',
                )}
              >
                {link.text}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

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
        'fixed top-0 w-full z-50 transition',
      )}
    >
      <Container>
        <div className="flex justify-between">
          <Logo />
          <Burger
            className="md:hidden z-50 relative"
            onClick={handleClick}
            navTheme={navTheme}
          />
          {activeMobileNav && (
            <div className="bg-white absolute inset-0 flex align-center justify-center">
              <NavList navigation={navigation} className="text-center" />
            </div>
          )}
          <NavList
            navTheme={navTheme}
            navigation={navigation}
            className="hidden md:flex items-center"
          />
        </div>
      </Container>
    </header>
  );
}

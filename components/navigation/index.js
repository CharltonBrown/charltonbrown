import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useContextSelector } from 'use-context-selector';
import clsx from 'clsx';
import { usePathname } from 'next/navigation';
import { motion, cubicBezier, AnimatePresence } from 'framer-motion';
import { Dialog } from '@headlessui/react';

import Logo from '@/components/logo';
import Burger from '@/components/burger';
import Container from '@/components/container';
import navContext from '@/lib/context/navContext';
import useIsOverlapping from '@/hooks/useIsOverlapping';

const NavList = ({ className, navigation, navTheme }) => {
  const pathname = usePathname();
  const ref = useRef();

  const { isOverlapping } = useIsOverlapping({
    rootRef: ref,
    targetClass: 'overlappingTarget',
  });

  return (
    <nav className={className} ref={ref}>
      <ul className="flex flex-col h-full justify-center text-2xl md:flex-row md:text-lg md:justify-between md:h-auto">
        {navigation.map((link) => {
          const isActive = pathname.startsWith(`/${link.href}`);
          return (
            <li className="md:px-3 last:md:pr-0" key={link.id}>
              <Link
                href={`/${link.href}`}
                className={clsx(
                  'block py-2 md:p-0 group',
                  isOverlapping && 'text-white',
                  (!isOverlapping || navTheme === 'dark') && 'text-black',
                  (isOverlapping || navTheme === 'light') && 'text-white',
                )}
              >
                {link.text}
                <span
                  className={clsx(
                    'block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5',
                    isActive && 'max-w-full',
                    (!isOverlapping || navTheme === 'dark') && 'bg-black',
                    (isOverlapping || navTheme === 'light') && 'bg-white',
                  )}
                />
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

const easing = cubicBezier(0.65, 0.06, 0.19, 0.96);

const variants = {
  visible: {
    y: 0,
    transition: {
      duration: 0.75,
      ease: easing,
    },
  },
  hidden: {
    y: -150,
    transition: {
      duration: 0.75,
      ease: easing,
    },
  },
};

function MobileNav({ navigation, active, handleClick }) {
  return (
    <AnimatePresence>
      {active && (
        <Dialog
          open={active}
          onClose={handleClick}
          as="div"
          className="fixed inset-0 z-10 flex items-center justify-center overflow-y-auto"
        >
          <div className="flex flex-col py-8 px-4 text-center">
            <Dialog.Overlay />
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
            >
              <div className="absolute inset-0 bg-white opacity-90" />
            </div>
            <NavList navigation={navigation} className="text-center relative" />
          </div>
        </Dialog>
      )}
    </AnimatePresence>
  );
}

export default function Navigation({ navigation, hideHeader, hideNavOnLoad }) {
  const [activeMobileNav, setActiveMobileNav] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const { navVisibility, logoTheme, linksTheme } = useContextSelector(
    navContext,
    (v) => v[0],
  );

  useEffect(() => {
    setLoaded(true);
  }, []);

  const handleClick = () => {
    setActiveMobileNav(!activeMobileNav);
  };

  const animate = () => {
    if (loaded && (navVisibility === 'hidden' || hideHeader)) return 'hidden';
    if (loaded && navVisibility === 'visible') return 'visible';
    return 'hidden';
  };

  return (
    <motion.header
      animate={animate()}
      initial={hideNavOnLoad ? 'hidden' : 'visible'}
      variants={variants}
      className={clsx(
        logoTheme === 'light' ? 'text-white' : 'text-black',
        'fixed top-0 w-full z-50 transition',
      )}
    >
      <Container>
        <div className="flex justify-between">
          <Logo />
          <MobileNav
            navigation={navigation}
            active={activeMobileNav}
            handleClick={handleClick}
          />
          <Burger
            className="md:hidden z-50 relative"
            onClick={handleClick}
            navTheme={linksTheme}
          />
          <NavList
            navTheme={linksTheme}
            navigation={navigation}
            className="hidden md:flex items-center place-self-center"
          />
        </div>
      </Container>
    </motion.header>
  );
}

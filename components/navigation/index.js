import React, { useState, useEffect } from 'react';
import { useContextSelector } from 'use-context-selector';
import clsx from 'clsx';
import { motion, cubicBezier } from 'framer-motion';

import Logo from '@/components/logo';
import Burger from '@/components/burger';
import Container from '@/components/container';
import navContext from '@/lib/context/navContext';
import MobileNavigation from '@/components/navigation/mobile-navigation';
import DesktopNavigation from '@/components/navigation/desktop-navigation';

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
    y: -100,
    transition: {
      duration: 0.25,
      ease: easing,
    },
  },
};

export default function Navigation({
  navigation,
  hideHeader,
  hideNavOnLoad,
  aboutUsNavigation,
  projectTypesNav,
}) {
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
        'fixed top-0 w-full z-20 transition',
      )}
    >
      <Container>
        <div className="flex justify-between">
          <Logo />
          <MobileNavigation
            navigation={navigation}
            aboutUsNavigation={aboutUsNavigation}
            projectTypesNav={projectTypesNav}
            active={activeMobileNav}
            onClick={handleClick}
          />
          <Burger
            className="md:hidden z-50 relative"
            onClick={handleClick}
            navTheme={linksTheme}
          />
          <DesktopNavigation
            navTheme={linksTheme}
            navigation={navigation}
            aboutUsNavigation={aboutUsNavigation}
            projectTypesNav={projectTypesNav}
          />
        </div>
      </Container>
    </motion.header>
  );
}

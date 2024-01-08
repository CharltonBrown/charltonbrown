import React, { useState, useEffect, useMemo } from 'react';
import { useContextSelector } from 'use-context-selector';
import clsx from 'clsx';
import { motion, cubicBezier } from 'framer-motion';
import { useRouter } from 'next/router';

import Logo from '@/components/logo';
import Burger from '@/components/burger';
import Container from '@/components/container';
import navContext from '@/lib/context/navContext';
import MobileNavigation from '@/components/navigation/mobile-navigation';
import DesktopNavigation from '@/components/navigation/desktop-navigation';
import { useBreakpoint } from '@/hooks/tailwind';

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
    y: -120,
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
  const isMdScreen = useBreakpoint('md');
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

  // disable logo and burger overlapping text change if not on homepage
  // and on small screen
  const { pathname } = useRouter();
  const disableOverlapping = pathname !== '/' && !isMdScreen;

  const animate = useMemo(() => {
    if (!isMdScreen && !hideHeader) return 'visible';
    if (loaded && (navVisibility === 'hidden' || hideHeader)) return 'hidden';
    if (loaded && navVisibility === 'visible') return 'visible';
    return 'visible';
  }, [navVisibility, hideHeader, loaded, isMdScreen]);

  return (
    <motion.header
      animate={animate}
      initial={hideNavOnLoad ? 'hidden' : 'visible'}
      variants={variants}
      className={clsx(
        logoTheme === 'light' ? 'text-white' : 'text-black',
        'absolute md:fixed top-0 w-full z-20 transition',
      )}
    >
      <Container>
        <div className="flex justify-between">
          <Logo disableOverlapping={disableOverlapping} />
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
            disableOverlapping={disableOverlapping}
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

import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Dialog } from '@headlessui/react';
import { usePathname } from 'next/navigation';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import Link from 'next/link';

import CloseIcon from '@/components/close-icon';
import { ABOUT_US_KEY, PROJECTS_KEY } from '@/lib/constants';

const subNavVariants = {
  visible: {
    opacity: 1,
    height: 'auto',
    transition: {
      height: {
        duration: 0.25,
      },
      opacity: {
        delay: 0.25,
        duration: 0.5,
      },
    },
  },
  hidden: { opacity: 0, height: 0 },
};

const NavList = ({
  className,
  navigation,
  aboutUsNavigation,
  projectTypesNav,
}) => {
  const pathname = usePathname();
  const subNavLookup = {
    [ABOUT_US_KEY]: aboutUsNavigation,
    [PROJECTS_KEY]: projectTypesNav,
  };
  const activeLink = navigation.find((link) =>
    pathname.startsWith(`/${link.href}`),
  );

  const [activeSubNav, setActiveSubNav] = useState(
    (activeLink && activeLink.href === ABOUT_US_KEY) ||
      (activeLink && activeLink.href === PROJECTS_KEY)
      ? activeLink.id
      : '',
  );

  const handleSubNavClick = (id) => {
    if (id === activeSubNav) {
      setActiveSubNav('');
    } else {
      setActiveSubNav(id);
    }
  };

  const animate = (id) => {
    if (activeSubNav === id) return 'visible';
    return 'hidden';
  };

  return (
    <nav className={className}>
      <ul className="flex flex-col h-full justify-center text-2xl">
        {navigation.map((link) => {
          const showAboutUsNav = link.href === ABOUT_US_KEY;
          const showProjectsNav = link.href === PROJECTS_KEY;

          return (
            <motion.li
              key={link.id}
              initial={{
                lineHeight: 0,
                opacity: 0,
              }}
              animate={{
                lineHeight: '40px',
                opacity: 1,
                transition: {
                  ease: 'easeOut',
                  duration: 0.5,
                },
              }}
              exit={{
                lineHeight: 0,
                opacity: 0,
                transition: {
                  ease: 'easeIn',
                  duration: 0.25,
                },
              }}
            >
              {showAboutUsNav || showProjectsNav ? (
                <>
                  <button
                    type="button"
                    className="py-2"
                    onClick={() => handleSubNavClick(link.id)}
                  >
                    <div className="flex items-center">
                      {link.text}
                      <ChevronDownIcon
                        className={clsx(
                          'w-4 h-4 ml-2 transition',
                          activeSubNav === link.id && 'rotate-180',
                        )}
                      />
                    </div>
                  </button>
                  <motion.div
                    initial={activeSubNav === link.id ? 'visible' : 'hidden'}
                    animate={animate(link.id)}
                    variants={subNavVariants}
                    className="overflow-hidden"
                  >
                    <ul className="pb-4">
                      {subNavLookup[link.href].map((subNavLink) => {
                        return (
                          <li key={subNavLink.id}>
                            <Link
                              href={`/${subNavLink.href}`}
                              className="block text-[18px] py-1 whitespace-nowrap"
                            >
                              {subNavLink.text}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </motion.div>
                </>
              ) : (
                <Link
                  href={`/${link.href}`}
                  className="block py-2 whitespace-nowrap"
                >
                  {link.text}
                </Link>
              )}
            </motion.li>
          );
        })}
      </ul>
    </nav>
  );
};

export default function MobileNavigation({
  navigation,
  aboutUsNavigation,
  projectTypesNav,
  active,
  onClick,
}) {
  return (
    <AnimatePresence>
      {active && (
        <Dialog
          open={active}
          onClose={onClick}
          as="div"
          static
          className="fixed inset-0 z-40 flex items-center justify-center overflow-y-auto md:hidden"
        >
          <Dialog.Overlay />
          <div className="fixed inset-0 transition-opacity" aria-hidden="true">
            <motion.div
              className="absolute inset-0 bg-white opacity-90"
              initial={{
                height: 0,
                opacity: 0,
              }}
              animate={{
                height: 'auto',
                opacity: 1,
                transition: {
                  ease: 'easeOut',
                  duration: 0.25,
                },
              }}
              exit={{
                height: 0,
                opacity: 0,
                transition: {
                  ease: 'easeIn',
                  duration: 0.25,
                },
              }}
            />
          </div>
          <Dialog.Panel className="min-h-[300px] overflow-hidden">
            <CloseIcon onClick={onClick} className="absolute right-4 top-4" />
            <NavList
              navigation={navigation}
              aboutUsNavigation={aboutUsNavigation}
              projectTypesNav={projectTypesNav}
              className="text-center relative"
            />
          </Dialog.Panel>
        </Dialog>
      )}
    </AnimatePresence>
  );
}

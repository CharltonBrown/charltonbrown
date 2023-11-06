import React, { useRef } from 'react';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import Link from 'next/link';

import { ABOUT_US_KEY, PROJECTS_KEY } from '@/lib/constants';
import useIsOverlapping from '@/hooks/useIsOverlapping';

const SubNavLink = ({ link, isActive, navTheme, isOverlapping }) => (
  <Link
    href={`/${link.href}`}
    className="block text-sm px-2 py-0 whitespace-nowrap group/border last:pr-3"
  >
    {link.text}
    <span
      className={clsx(
        'block max-w-0 group-hover/border:max-w-full transition-all h-px',
        isActive && 'max-w-full',
        navTheme === 'light' && 'bg-white',
        navTheme === 'dark' && !isOverlapping && 'bg-black',
        navTheme === 'dark' && isOverlapping && 'bg-white',
      )}
    />
  </Link>
);

const NavLink = ({ link, navTheme, isOverlapping, isActive }) => {
  return (
    <Link
      href={`/${link.href}`}
      className="block group/border whitespace-nowrap"
    >
      {link.text}
      <span
        className={clsx(
          'block max-w-0 group-hover/border:max-w-full transition-all h-0.5',
          isActive && 'max-w-full',
          navTheme === 'light' && 'bg-white',
          navTheme === 'dark' && !isOverlapping && 'bg-black',
          navTheme === 'dark' && isOverlapping && 'bg-white',
        )}
      />
    </Link>
  );
};

export default function DesktopNavigation({
  navigation,
  navTheme,
  aboutUsNavigation,
  projectTypesNav,
}) {
  const pathname = usePathname();
  const subNavLookup = {
    [ABOUT_US_KEY]: aboutUsNavigation,
    [PROJECTS_KEY]: projectTypesNav,
  };

  const ref = useRef();
  const { isOverlapping } = useIsOverlapping({
    rootRef: ref,
    targetClass: 'overlappingTarget',
  });

  return (
    <nav className="hidden md:flex items-center place-self-center" ref={ref}>
      <ul className="flex flex-row text-lg justify-between h-auto relative">
        {navigation.map((link) => {
          const isActive = pathname.startsWith(`/${link.href}`);
          const showAboutUsNav = link.href === ABOUT_US_KEY;
          const showProjectsNav = link.href === PROJECTS_KEY;

          return (
            <li
              key={link.id}
              className={clsx(
                'px-3 transition',
                navTheme === 'light' && 'text-white',
                navTheme === 'dark' && !isOverlapping && 'text-black',
                navTheme === 'dark' && isOverlapping && 'text-white',
              )}
            >
              {showAboutUsNav || showProjectsNav ? (
                <span className="group/subNav">
                  <NavLink
                    link={link}
                    isActive={isActive}
                    navTheme={navTheme}
                    isOverlapping={isOverlapping}
                  />
                  <ul className="hidden absolute top-full pt-2 right-0 group-hover/subNav:flex">
                    {subNavLookup[link.href].map((subNavLink) => {
                      const isSubNavActive = pathname.endsWith(
                        `/${subNavLink.href}`,
                      );
                      return (
                        <li key={subNavLink.id}>
                          <SubNavLink
                            link={subNavLink}
                            isActive={isSubNavActive}
                            navTheme={navTheme}
                            isOverlapping={isOverlapping}
                          />
                        </li>
                      );
                    })}
                  </ul>
                </span>
              ) : (
                <NavLink
                  link={link}
                  isActive={isActive}
                  navTheme={navTheme}
                  isOverlapping={isOverlapping}
                />
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

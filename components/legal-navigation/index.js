import React from 'react';
import Link from 'next/link';
import clsx from 'clsx';

export default function LegalNavigation({ legalNavigation, className }) {
  return (
    <nav className={clsx('w-full', className)}>
      <ul className="flex flex-col sm:flex-row sm:justify-center sm:items-center sm:gap-8 md:gap-12 text-sm md:text-md">
        <li className="text-silver">
          Copyright © {new Date().getFullYear()} Charlton Brown
        </li>
        {legalNavigation.map((link) => (
          <li key={link.id}>
            <Link
              href={`/${link.href}`}
              className="block py-2 md:p-0 text-silver"
            >
              {link.text}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

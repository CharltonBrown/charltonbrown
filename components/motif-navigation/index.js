import Link from 'next/link';
import React from 'react';
import MotifOne from '../icons/motif-1';

export default function MotifNavigation({ links }) {
  return (
    <nav className="mt-16">
      <ul className="grid grid-cols-2 w-56 mx-auto gap-8 place-content-center lg:grid-cols-4 lg:w-auto">
        {links.map((link) => (
          <li
            key={link.id}
            className="flex flex-col items-center w-24 lg:w-auto"
          >
            <Link href={link.href}>
              <MotifOne className="w-24" />
            </Link>
            <span className="block mt-2 font-savoyItalic text-lg">
              {link.text}
            </span>
          </li>
        ))}
      </ul>
    </nav>
  );
}

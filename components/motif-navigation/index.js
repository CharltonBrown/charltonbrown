import Link from 'next/link';
import React from 'react';
import MotifOne from '../icons/motif-1';

export default function MotifNavigation({ links }) {
  return (
    <nav className="my-24">
      <ul className="flex flew-row gap-20">
        {links.map((link) => (
          <li key={link.id}>
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

import React from 'react';
import Link from 'next/link';

export default function FooterNavigation({ footerNavigation }) {
  return (
    <navigation className="w-full">
      <ul className="flex justify-center gap-8 md:gap-12">
        <li className="text-silver">
          Copyright © {new Date().getFullYear()} Charlton Brown
        </li>
        {footerNavigation.map((link) => (
          <li key={link.id}>
            <Link href={link.href} className="block py-2 md:p-0 text-silver">
              {link.text}
            </Link>
          </li>
        ))}
      </ul>
    </navigation>
  );
}

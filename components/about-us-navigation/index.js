import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

import { getAbsoluteUrl } from '@/lib/utils/vercel-utils';

export default function AboutUsNav({ links }) {
  const pathname = usePathname();
  return (
    <nav>
      <ul className="flex flex-col">
        {links.map((link) => {
          const isActive = pathname.endsWith(link.href);
          return (
            <li key={link.id} className="mb-2">
              <Link
                className={clsx(
                  'text-lg tracking-wider hover:text-black focus:text-black transition',
                  !isActive && 'text-silver',
                )}
                href={`${getAbsoluteUrl()}/${link.href}`}
              >
                {link.text}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

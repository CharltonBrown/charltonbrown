import React from 'react';
import Link from 'next/link';

import { getAbsoluteUrl } from '@/lib/utils/vercel-utils';

export default function AboutUsNav({ links }) {
  console.log(getAbsoluteUrl());
  console.log({ links });
  return (
    <nav>
      <ul className="flex flex-col">
        {links.map((link) => (
          <li key={link.id}>
            <Link
              className="text-xl text-silver"
              href={`${getAbsoluteUrl()}/${link.href}`}
            >
              {link.text}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

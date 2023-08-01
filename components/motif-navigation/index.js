import Link from 'next/link';
import React from 'react';
import Image from 'next/image';
import clsx from 'clsx';

export default function MotifNavigation({ links }) {
  const hoverClasses = [
    'group-hover:bg-gullGray/50',
    'group-hover:bg-casablanca/50',
    'group-hover:bg-fernFrond/50',
    'group-hover:bg-oldBrick/50',
  ];

  return (
    <nav className="mt-16">
      <ul className="grid grid-cols-2 w-64 gap-10 mx-auto lg:flex lg:w-auto lg:justify-between">
        {links.map((link, index) => (
          <li
            key={link.id}
            className="flex flex-col items-center w-24 lg:w-auto"
          >
            <Link href={link.href} className="group">
              <div className="relative">
                <Image
                  src={link.motif.svg.url}
                  width={96}
                  height={96}
                  alt={`${link.text} icon`}
                  className="border border-black"
                />
                <div
                  className={clsx(
                    'absolute inset-0 transition',
                    hoverClasses[index],
                  )}
                />
              </div>
              <span className="block mt-2 font-savoyItalic text-lg text-center">
                {link.text}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

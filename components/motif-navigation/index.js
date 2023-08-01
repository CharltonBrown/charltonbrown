import Link from 'next/link';
import React from 'react';
import Image from 'next/image';

export default function MotifNavigation({ links }) {
  // const hoverClasses = {
  //   0: 'absolute inset-0 group-hover:gullGray/50',
  //   1: 'absolute inset-0 group-hover:casablanca/50',
  //   2: 'absolute inset-0 group-hover:nandor/50',
  //   3: 'absolute inset-0 group-hover:oldBrick/50',
  // };

  return (
    <nav className="mt-16">
      <ul className="grid grid-cols-2 w-64 gap-10 mx-auto lg:flex lg:w-auto lg:justify-between">
        {links.map((link) => (
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
                {/* <div className={`${hoverClasses[link.href]}`} /> */}
                <div className="absolute inset-0 transition group-hover:bg-oldBrick/50" />
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

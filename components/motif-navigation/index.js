import React, { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import clsx from 'clsx';
import { motion, useInView } from 'framer-motion';

import { easing } from '@/components/fade-in-block/fadeVariants';

const variants = {
  visible: {
    transition: {
      staggerChildren: 0.125,
    },
  },
};

const itemVariants = {
  hidden: {
    y: '-50px',
  },
  visible: {
    y: 0,
    transition: {
      y: {
        duration: 1.5,
        ease: easing,
      },
    },
  },
};

export default function MotifNavigation({ links }) {
  const ref = useRef();
  const hoverClasses = [
    'group-hover:bg-gullGray/50',
    'group-hover:bg-casablanca/50',
    'group-hover:bg-fernFrond/50',
    'group-hover:bg-oldBrick/50',
  ];

  const isInView = useInView(ref, { once: true });

  const animate = () => {
    if (isInView) return 'visible';
    if (!isInView) return 'hidden';
    return 'hidden';
  };

  return (
    <nav className="mt-16">
      <motion.ul
        ref={ref}
        animate={animate()}
        initial="hidden"
        variants={variants}
        className="grid grid-cols-2 w-64 gap-10 mx-auto lg:flex lg:w-auto lg:justify-between"
      >
        {links.map((link, index) => (
          <motion.li
            key={link.id}
            variants={itemVariants}
            className="flex flex-col items-center w-24 lg:w-auto"
          >
            <Link href={link.href} className="group">
              <div className="relative">
                <Image
                  src={link.motif.svg.url}
                  width={96}
                  height={96}
                  alt=""
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
          </motion.li>
        ))}
      </motion.ul>
    </nav>
  );
}

import React, { useEffect, useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useContextSelector } from 'use-context-selector';
import clsx from 'clsx';
import { motion, cubicBezier } from 'framer-motion';
import { useRouter } from 'next/router';

import navContext from '@/lib/context/navContext';

const easing = cubicBezier(0.65, 0.06, 0.19, 0.96);

const variants = {
  visible: {
    y: 0,
    transition: {
      delay: 0.75,
    },
  },
  hidden: {
    y: -150,
    transition: {
      duration: 1,
      ease: easing,
    },
  },
  rotate: {
    duration: 0.5,
    ease: 'backInOut',
  },
};

export default function ExitPageCloseIcon({ href, className }) {
  const [loaded, setLoaded] = useState(false);
  const setNavContext = useContextSelector(navContext, (v) => v[1]);
  const router = useRouter();

  useEffect(() => {
    setLoaded(true);
    return () => {
      setLoaded(false);
    };
  }, [setLoaded]);

  const handleClick = () => {
    setLoaded(false);
    setNavContext((s) => ({
      ...s,
      navVisibility: 'visible',
    }));
    router.push(href);
  };

  const animate = () => {
    if (loaded) return 'visible';
    if (!loaded) return 'hidden';
    return 'hidden';
  };

  return (
    <motion.div
      className={clsx(
        className,
        'origin-center w-10 h-10 flex items-center justify-center',
      )}
      animate={animate()}
      initial="hidden"
      variants={variants}
      whileHover={{
        rotate: 90,
      }}
    >
      <button type="button" onClick={handleClick}>
        <XMarkIcon className="w-10 h-10 text-black" />
      </button>
    </motion.div>
  );
}

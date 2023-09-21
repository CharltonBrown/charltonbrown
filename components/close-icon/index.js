import React, { useEffect, useState, useRef } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { motion, cubicBezier } from 'framer-motion';

import useIsOverlapping from '@/hooks/useIsOverlapping';

const easing = cubicBezier(0.65, 0.06, 0.19, 0.96);

const variants = {
  visible: {
    y: 0,
    transition: {
      delay: 0.75,
      ease: easing,
    },
  },
  hidden: {
    y: -100,
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

export default function CloseIcon({ onClick, className }) {
  const [loaded, setLoaded] = useState(false);
  const ref = useRef();

  useEffect(() => {
    setLoaded(true);
    return () => {
      setLoaded(false);
    };
  }, [setLoaded]);

  const { isOverlapping } = useIsOverlapping({
    rootRef: ref,
    targetClass: 'overlappingTarget',
    inside: true,
    scrollElement: '#scrollSnapParent',
  });

  const handleClick = () => {
    setLoaded(false);
    onClick();
  };

  const animate = () => {
    if (loaded) return 'visible';
    if (!loaded) return 'hidden';
    return 'hidden';
  };

  return (
    <motion.div
      ref={ref}
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
        <XMarkIcon
          className={clsx(
            'w-10 h-10',
            isOverlapping ? 'text-white' : 'text-black',
          )}
        />
      </button>
    </motion.div>
  );
}

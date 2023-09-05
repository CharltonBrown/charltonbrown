import React, { useRef, useEffect, useState } from 'react';
import { motion, useCycle, AnimatePresence, cubicBezier } from 'framer-motion';
import clsx from 'clsx';

import useIsOverlapping from '@/hooks/useIsOverlapping';

const easing = cubicBezier(0.65, 0.06, 0.19, 0.96);

const titleVariants = {
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
};

const panelVariants = {
  hidden: {
    opacity: 0,
    x: '-75%',
    transition: {
      ease: 'easeOut',
      duration: 0.75,
    },
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      ease: 'easeOut',
      duration: 0.5,
    },
  },
};

export default function ProjectInfo({ title, description }) {
  const ref = useRef();
  const { isOverlapping } = useIsOverlapping({
    rootRef: ref,
    targetClass: 'overlappingTarget',
    inside: true,
    scrollElement: '#scrollSnapParent',
  });
  const [open, cycleOpen] = useCycle(false, true);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
    return () => {
      setLoaded(false);
    };
  }, [setLoaded]);

  const animate = () => {
    if (loaded) return 'visible';
    if (!loaded) return 'hidden';
    return 'hidden';
  };

  return (
    <>
      <div className="fixed z-30 top-0 left-0 w-full">
        <motion.div
          ref={ref}
          className={clsx(
            'w-[300px] p-5 md:p-8 lg:p-10',
            isOverlapping && 'text-white',
            open && '!text-black',
          )}
          animate={animate()}
          initial="hidden"
          variants={titleVariants}
        >
          <h1 className="text-2xl mb-2">{title}</h1>
          <button type="button" onClick={cycleOpen}>
            {open ? 'Hide text' : 'Read more'}
          </button>
        </motion.div>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial="hidden"
            animate={open && 'visible'}
            variants={panelVariants}
            exit="hidden"
            className="absolute z-20 top-0 bottom-0 left-0 w-full h-screen p-8 pt-32 bg-white/95 md:w-1/2 lg:w-1/3 text-2xl overflow-y-scroll no-scrollbar"
          >
            {/* <div className="absolute z-30 w-full h-56 top-0 left-0 w-full bg-gradient-to-b from-white via-white via-85% to-transparent" /> */}
            <div
              dangerouslySetInnerHTML={{ __html: description }}
              className="z-10"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

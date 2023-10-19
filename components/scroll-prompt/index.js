import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import { motion, cubicBezier } from 'framer-motion';

const parentVariants = {
  visible: {
    transition: {
      staggerChildren: 0.25,
    },
  },
  hidden: {
    transition: {
      staggerChildren: 0.25,
      staggerDirection: -1,
    },
  },
};

const opacityVariants = {
  visible: {
    opacity: 1,
    transition: {
      duration: 0.25,
    },
  },
  hidden: {
    opacity: 0,
    transition: {
      duration: 0.25,
    },
  },
};

const heightVariants = {
  visible: {
    height: 120,
    transition: {
      duration: 0.5,
    },
  },
  hidden: {
    height: 0,
    transition: {
      duration: 0.25,
    },
  },
};

export default function ScrollPrompt({ className }) {
  const [visibility, setVisibility] = useState('hidden');
  const [scrollTop, setScrollTop] = useState(0);

  useEffect(() => {
    if (scrollTop === 0) {
      setTimeout(() => {
        setVisibility('visible');
      }, 2000);
    } else {
      setVisibility('hidden');
    }
  }, [scrollTop]);

  useEffect(() => {
    const onScroll = (e) => {
      setScrollTop(e.target.documentElement.scrollTop);
    };
    window.addEventListener('scroll', onScroll);

    return () => window.removeEventListener('scroll', onScroll);
  }, [scrollTop]);

  return (
    <div className={clsx('overflow-hidden', className)}>
      <motion.div
        animate={visibility}
        variants={parentVariants}
        className="flex flex-col h-36 items-center text-white"
      >
        <motion.p variants={opacityVariants} className="text-lg mb-2">
          Scroll
        </motion.p>
        <motion.div variants={heightVariants} className="overflow-hidden">
          <motion.div
            animate={{
              y: 10,
            }}
            transition={{
              duration: 0.75,
              repeat: Infinity,
              repeatType: 'reverse',
              ease: cubicBezier(0.0, 0.0, 0.2, 1),
            }}
            className="w-px h-32 bg-white will-change-transform"
          />
        </motion.div>
      </motion.div>
    </div>
  );
}

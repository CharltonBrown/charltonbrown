import React, { useRef } from 'react';
import { motion, useTransform, useScroll, useSpring } from 'framer-motion';

const rand = (min = 0, max = 100) => {
  return Math.floor(Math.random() * (+max - +min)) + +min;
};

export default function ParallaxItem({ children }) {
  const ref = useRef();
  const { scrollYProgress } = useScroll({
    offset: ['start start', 'end start'],
  });

  const springConfig = {
    damping: 100,
    stiffness: 100,
    mass: rand(1, 3),
  };

  const y = useSpring(
    useTransform(scrollYProgress, [0, 1], ['0%', '125%']),
    springConfig,
  );

  return (
    <div ref={ref}>
      <motion.div ref={ref} initial={{ y: 0 }} style={{ y }}>
        {children}
      </motion.div>
    </div>
  );
}

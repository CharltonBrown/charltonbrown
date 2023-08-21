import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-cool-inview';

import fadeVariants from './fadeVariants';

export default function FadeInBlock({ children, className }) {
  const {
    observe,
    inView,
    scrollDirection: { vertical },
  } = useInView();

  const animate = () => {
    if (inView) return 'visible';
    if (!inView && vertical === 'down') return 'hiddenTop';
    if (!inView && vertical === 'up') return 'hiddenBottom';
    return 'hiddenTop';
  };

  return (
    <motion.div
      ref={observe}
      animate={animate()}
      initial="hiddenTop"
      variants={fadeVariants}
      className={className}
    >
      {children}
    </motion.div>
  );
}

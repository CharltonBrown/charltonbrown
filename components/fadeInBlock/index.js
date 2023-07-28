import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

import fadeVariants from './fadeVariants';

export default function FadeInBlock({ children, className }) {
  const ref = useRef(null);
  const isInView = useInView(ref);

  return (
    <motion.div
      ref={ref}
      animate={isInView && 'visible'}
      initial="hidden"
      variants={fadeVariants}
      className={className}
    >
      {children}
    </motion.div>
  );
}

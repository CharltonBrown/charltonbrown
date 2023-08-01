import React, { useRef, useState, useLayoutEffect } from 'react';
import { motion, useTransform, useScroll, useSpring } from 'framer-motion';

const calculateMinHeight = (height, range) => {
  return height + height * range;
};

const rand = (min = 0, max = 100) => {
  return Math.floor(Math.random() * (+max - +min)) + +min;
};

export default function ParallaxItem({
  children,
  className,
  topOffset = -500,
  bottomOffset = 500,
  range = 0.5,
  parentRef,
}) {
  const { scrollY } = useScroll({ container: parentRef });
  const ref = useRef();
  const [minHeight, setMinHeight] = useState('auto');
  const [elementTop, setElementTop] = useState(0);
  const springConfig = {
    damping: 100,
    stiffness: 100,
    mass: rand(1, 3),
  };

  useLayoutEffect(() => {
    if (!ref.current) return;
    const onResize = () => {
      setElementTop(ref.current.offsetTop);
      setMinHeight(calculateMinHeight(ref.current.offsetHeight, range));
    };

    onResize();
    window.addEventListener('resize', onResize);
    // eslint-disable-next-line consistent-return
    return () => window.removeEventListener('resize', onResize);
  }, [ref, range]);

  const y = useSpring(
    useTransform(
      scrollY,
      [elementTop + topOffset, elementTop + bottomOffset],
      ['0%', `${range * 100}%`],
    ),
    springConfig,
  );

  return (
    <div style={{ minHeight }} className={className}>
      <motion.div ref={ref} initial={{ y: 0 }} style={{ y }}>
        {children}
      </motion.div>
    </div>
  );
}

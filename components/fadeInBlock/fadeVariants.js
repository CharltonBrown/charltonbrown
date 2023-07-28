import { cubicBezier } from 'framer-motion';

const easing = cubicBezier(0.18, 1, 0.21, 1);

const fadeVariants = {
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      opacity: {
        duration: 2.5,
        ease: easing,
      },
      y: {
        duration: 4,
        ease: easing,
      },
    },
  },
  hidden: { opacity: 0, y: '100px' },
};

export default fadeVariants;

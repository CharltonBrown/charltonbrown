import { cubicBezier } from 'framer-motion';

const easing = cubicBezier(0.18, 1, 0.21, 1);

const fadeVariants = {
  hidden: { opacity: 0, y: '200px' },
  hiddenTop: { opacity: 0, y: '200px' },
  hiddenBottom: { opacity: 0, y: '-200px' },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      opacity: {
        duration: 2.5,
        ease: easing,
      },
      y: {
        duration: 3.5,
        ease: easing,
      },
    },
  },
};

export default fadeVariants;

import React from 'react';
import { AnimatePresence, motion, useCycle } from 'framer-motion';

const sideVariants = {
  closed: {
    transition: {
      staggerChildren: 0.2,
      staggerDirection: -1,
    },
  },
  open: {
    transition: {
      staggerChildren: 0.2,
      staggerDirection: 1,
    },
  },
};

export default function SubNavigation({ children }) {
  const [open, cycleOpen] = useCycle(false, true);
  return (
    <>
      <div className="lg:hidden h-screen flex sticky top-0 flex justify-center">
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ width: 0, x: -150 }}
              animate={{
                width: 150,
                x: 0,
              }}
              exit={{
                width: 0,
                x: -150,
                transition: { duration: 0.3 },
              }}
              className="h-screen flex flex-col items-center justify-center overflow-hidden"
            >
              <motion.div
                className="w-[150px]"
                initial="closed"
                animate="open"
                exit="closed"
                variants={sideVariants}
              >
                {children}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        <div className="flex items-center justify-center shrink-0">
          <button type="button" onClick={cycleOpen}>
            {open ? 'Close' : 'Open'}
          </button>
        </div>
      </div>

      <div className="hidden lg:flex lg:w-[220px] shrink-0 h-screen sticky top-0 flex flex-col justify-center">
        {children}
      </div>
    </>
  );
}

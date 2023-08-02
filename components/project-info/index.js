import React from 'react';
import { motion, useCycle, AnimatePresence } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

import Container from '@/components/container';

const variants = {
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
  const [open, cycleOpen] = useCycle(false, true);
  return (
    <>
      <div className="fixed z-40 top-0 left-0 w-full">
        <Container>
          <div>
            <h1 className="text-2xl mb-2">{title}</h1>
            <button type="button" onClick={cycleOpen}>
              {open ? 'Hide text' : 'Read more'}
            </button>
          </div>
          <Link
            href="/projects"
            className="absolute right-4 top-4 w-12 h-12 block z-20"
          >
            <XMarkIcon className=" " />
          </Link>
        </Container>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial="hidden"
            animate={open && 'visible'}
            variants={variants}
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

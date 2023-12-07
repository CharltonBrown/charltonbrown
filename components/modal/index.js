import * as React from 'react';
import { Dialog } from '@headlessui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/outline';

export default function Modal({ isOpen, setIsOpen, children }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog
          open={isOpen}
          onClose={setIsOpen}
          as="div"
          className="fixed inset-0 w-full md:w-auto z-50 flex items-start md:items-center justify-center overflow-y-auto"
        >
          <div className="flex flex-col w-full md:w-auto md:py-8 md:px-4 text-center overflow-y-auto">
            <Dialog.Overlay />
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
              onClick={() => setIsOpen()}
            >
              <div className="absolute inset-0 bg-white opacity-75" />
            </div>
            <motion.div
              className="w-full md:w-auto overflow-y-auto flex items-start justify-center min-h-screen md:px-4 md:pb-20 text-center md:items-center"
              initial={{
                opacity: 0,
                scale: 0.95,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                transition: {
                  ease: 'easeOut',
                  duration: 0.25,
                },
              }}
              exit={{
                opacity: 0,
                scale: 0.95,
                transition: {
                  ease: 'easeIn',
                  duration: 0.25,
                },
              }}
            >
              <div
                className="relative w-full md:w-auto inline-block md:border border-silver bg-white text-left shadow-xl transform transition-all pt-24 p-12 md:pt-12"
                role="dialog"
                aria-modal="true"
              >
                <button
                  type="button"
                  className="absolute top-8 right-8"
                  onClick={() => setIsOpen()}
                >
                  <XMarkIcon className="w-8 h-8" />
                </button>
                {children}
              </div>
            </motion.div>
          </div>
        </Dialog>
      )}
    </AnimatePresence>
  );
}

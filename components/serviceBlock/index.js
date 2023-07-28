import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';

export default function ServiceBlock({
  title,
  intro,
  body,
  steps,
  onClick,
  open,
}) {
  return (
    <section
      onClick={onClick}
      onKeyDown={onClick}
      role="button"
      tabIndex="0"
      className="mb-16"
    >
      <h2 className="text-2xl lg:text-3xl mb-8 uppercase text-center font-savoyBold">
        {title}
      </h2>
      <div
        dangerouslySetInnerHTML={{
          __html: intro,
        }}
        className="mx-auto mb-4 lg:text-xl text-center max-w-prose font-savoyBold"
      />
      <AnimatePresence>
        {open && (
          <motion.div
            className="max-w-3xl mx-auto overflow-hidden"
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            transition={{ type: 'spring', bounce: 0.2, duration: 0.8 }}
          >
            <div
              dangerouslySetInnerHTML={{
                __html: body,
              }}
              className="mx-auto mb-4 lg:text-xl text-center max-w-prose font-savoyBold"
            />
            <ol className="my-8 grid grid-flow-col grid-cols-2 grid-rows-3 list-decimal text-lg">
              {steps.map((step) => (
                <li key={step.id} className="mb-2">
                  {step.title}
                </li>
              ))}
            </ol>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

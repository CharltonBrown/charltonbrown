/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import clsx from 'clsx';
import Image from 'next/image';
import converter from 'number-to-words';

import FadeInBlock from '@/components/fade-in-block';
import richTextStyles from '@/components/rich-text/rich-text.module.css';

function AccordionStep({ body, title, image, onClick, index }) {
  return (
    <FadeInBlock>
      <article>
        <button
          onClick={onClick}
          type="button"
          className="flex items-center justify-between w-full text-left"
        >
          <div className="flex items-center">
            <span className="md:text-xl text-silver font-sans min-w-[40px] block md:pr-8">
              <span className="hidden md:inline">Stage</span>{' '}
              {converter.toWords(index + 1)}
            </span>
            <h3 className="text-xl lg:text-2xl">{title}</h3>
          </div>
        </button>
        <AnimatePresence>
          {/* {open && ( */}
          <motion.div
            className="mx-auto overflow-hidden"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: 'spring', bounce: 0.2, duration: 0.8 }}
          >
            <div className="flex flex-col md:flex-row py-12 gap-8">
              <div className="text-left grow">
                <div
                  dangerouslySetInnerHTML={{
                    __html: body,
                  }}
                  className={richTextStyles.richText}
                />
              </div>
              <div className="max-w-md max-h-md">
                <Image
                  src={image.responsiveImage.src}
                  alt={image.responsiveImage.alt}
                  width={0}
                  height={0}
                  sizes="100vw"
                  className="w-full h-auto"
                />
              </div>
            </div>
          </motion.div>
          {/* )} */}
        </AnimatePresence>
      </article>
    </FadeInBlock>
  );
}

export default function ServiceBlock({ title, intro, body, steps }) {
  const [openStepId, setOpenStepId] = useState('');

  const handleClick = (id) => {
    if (id === openStepId) {
      setOpenStepId('');
      return;
    }
    setOpenStepId(id);
  };

  return (
    <section
      className={clsx(
        'mx-auto mb-16 pb-16 border-b last:border-0 border-gray transition duration-500 flex flex-col items-center text-left md:text-center md:flex-row md:gap-24 md:relative md:items-start md:border-0 md:mb-56',
        // !open && 'hover:opacity-50',
      )}
    >
      <div
        // onClick={onClick}
        className="text-left md:sticky md:top-56 md:w-1/2"
      >
        <h2 className="text-2xl lg:text-3xl mb-8 font-savoyBold">{title}</h2>
        <div
          dangerouslySetInnerHTML={{
            __html: intro,
          }}
          className="mx-auto mb-4 lg:text-xl max-w-prose font-savoyBold md:mx-0"
        />
        <div
          dangerouslySetInnerHTML={{
            __html: body,
          }}
          className="mx-auto mb-4 lg:text-xl max-w-prose font-savoyBold md:mx-0"
        />
      </div>
      <AnimatePresence>
        {/* {open && ( */}
        <motion.div
          className="w-full overflow-hidden md:w-1/2"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ type: 'spring', bounce: 0.2, duration: 0.8 }}
        >
          <ol className="my-8">
            {steps.map((step, index = 1) => (
              <li key={step.id} className="mb-2 md:mb-24">
                <AccordionStep
                  title={step.title}
                  open={openStepId === step.id}
                  body={step.body}
                  image={step.image}
                  onClick={() => handleClick(step.id)}
                  index={index}
                />
              </li>
            ))}
          </ol>
        </motion.div>
        {/* )} */}
      </AnimatePresence>
    </section>
  );
}

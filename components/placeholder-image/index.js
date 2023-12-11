import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Image } from 'react-datocms';

import clsx from 'clsx';
import { AnimatePresence, motion, useInView } from 'framer-motion';

const brandColors = [
  'bg-casablanca',
  'bg-gullGray',
  'bg-envy',
  'bg-oldBrick',
  'bg-cameo',
  'bg-matrix',
  'bg-outerSpace',
  'bg-almond',
  'bg-fernFrond',
];

export default function PlaceholderImage({
  image,
  className,
  hoverEffect,
  overlappingTarget,
  layout,
}) {
  const ref = useRef();
  const isInView = useInView(ref);
  const [showPlaceholder, setShowPlaceholder] = useState(true);
  const [loadingComplete, setLoadingComplete] = useState(false);

  const randomBg = useMemo(
    () => brandColors[Math.floor(Math.random() * brandColors.length)],
    [],
  );

  useEffect(() => {
    if (isInView && loadingComplete) {
      setTimeout(() => setShowPlaceholder(false), 600);
    }
  }, [isInView, loadingComplete]);

  return (
    <div
      ref={ref}
      className={clsx(
        'relative w-full flex justify-center items-center overflow-hidden group',
        className,
      )}
    >
      <Image
        data={image}
        className={clsx(
          'w-full',
          className,
          overlappingTarget && 'overlappingTarget',
        )}
        pictureClassName={clsx(
          'w-full',
          className,
          overlappingTarget && 'overlappingTarget',
        )}
        alt={image.alt || ''}
        layout={layout}
        objectFit={layout === 'fill' && 'cover'}
        onLoad={() => setLoadingComplete(true)}
        priority
        usePlaceholder
      />
      <div
        className={clsx(
          `${randomBg} absolute inset-0 opacity-0 transition duration-500`,
          hoverEffect && 'group-hover:opacity-50',
          showPlaceholder && 'opacity-90',
        )}
      />
      <AnimatePresence>
        {showPlaceholder && (
          <motion.div
            className="absolute w-1 h-9 bg-white animate-spin"
            exit={{
              opacity: 0,
              transition: {
                ease: 'easeIn',
                duration: 0.25,
              },
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

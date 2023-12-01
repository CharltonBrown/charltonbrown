import React, { useState, useEffect, useCallback } from 'react';
import { useAnimate } from 'framer-motion';
import clsx from 'clsx';
import { PlusIcon } from '@heroicons/react/24/outline';

import RichText from '@/components/rich-text';
import useScrollIntoView from '@/hooks/useScrollIntoView';
import PlaceholderImage from '@/components/placeholder-image';
import { useBreakpoint } from '@/hooks/tailwind';

function AccordionItem({ item, index, open, onClick }) {
  const [scrollRef, setShouldScrollTo] = useScrollIntoView();
  const [bodyScope, animateBody] = useAnimate();

  const handleToggle = useCallback(async () => {
    if (open) {
      await animateBody(
        bodyScope.current,
        { height: 'auto', opacity: 1 },
        { duration: 0.25 },
      );
      await setShouldScrollTo(true);
    } else {
      await animateBody(
        bodyScope.current,
        { height: 0, opacity: 0 },
        { duration: 0.25 },
      );
    }
  }, [animateBody, bodyScope, open, setShouldScrollTo]);

  useEffect(() => {
    handleToggle();
  }, [open, handleToggle]);

  const handleClick = () => {
    onClick(item.id);
  };

  return (
    <div
      ref={scrollRef}
      className="scroll-mt-10 md:scroll-mt-24 lg:scroll-mt-48 mb-8"
    >
      <h3
        className={clsx(
          'text-xl transition-all delay-100 ease-out',
          open ? 'mb-24 lg:mb-48' : 'mb-4',
        )}
      >
        <button
          type="button"
          onClick={() => handleClick()}
          className="flex w-full justify-between items-center hover:opacity-50 transition"
        >
          {index + 1}. {item.heading}
          <PlusIcon
            className={clsx(
              'w-6 h-6 border rounded-full transition',
              open && 'rotate-45',
            )}
          />
        </button>
      </h3>
      <div className="h-0 opacity-0 overflow-hidden" ref={bodyScope}>
        <div className="mb-8 lg:hidden">
          <PlaceholderImage
            width={item.image.responsiveImage.width}
            height={item.image.responsiveImage.height}
            src={item.image.responsiveImage.src}
            alt={item.image.responsiveImage.alt}
          />
        </div>
        <RichText text={item.body} />
      </div>
    </div>
  );
}

export default function Accordion({
  serviceImage,
  items,
  onClose,
  openService,
}) {
  const [activeItem, setActiveItem] = useState(null);
  const [imageScope, animateImage] = useAnimate();
  const isLgScreen = useBreakpoint('lg');

  const hideImage = useCallback(async () => {
    await animateImage(
      imageScope.current,
      { x: -200, opacity: 0 },
      { duration: 0.25 },
    );
    await animateImage(imageScope.current, {
      display: 'none',
    });
  }, [animateImage, imageScope]);

  const showImage = useCallback(async () => {
    await animateImage(imageScope.current, {
      display: 'block',
    });
    await animateImage(
      imageScope.current,
      { x: 0, opacity: 1 },
      { duration: 0.25 },
    );
  }, [animateImage, imageScope]);

  const handleClose = useCallback(async () => {
    if (isLgScreen && !openService) {
      await hideImage();
      await setActiveItem(null);
      return;
    }
    if (!openService) {
      setActiveItem(null);
    }
  }, [hideImage, isLgScreen, openService]);

  useEffect(() => {
    handleClose();
  }, [handleClose, onClose]);

  useEffect(() => {
    if (openService) {
      showImage();
    }
  }, [openService, showImage]);

  const handleClick = async (id) => {
    if (activeItem?.id === id) {
      await hideImage();
      await setActiveItem(null);
      await showImage();
      return;
    }

    await hideImage();
    await setActiveItem(items.find((item) => item.id === id));
    await showImage();
  };

  return (
    <div className="my-8 lg:flex lg:my-6 lg:py-12">
      <div className="hidden lg:flex flex-col justify-end lg:w-1/2 lg:mt-10">
        <div className="lg:sticky bottom-0 pr-24" ref={imageScope}>
          {activeItem ? (
            <PlaceholderImage
              width={activeItem.image.responsiveImage.width}
              height={activeItem.image.responsiveImage.height}
              src={activeItem.image.responsiveImage.src}
              alt={activeItem.image.responsiveImage.alt}
            />
          ) : (
            <PlaceholderImage
              width={serviceImage.responsiveImage.width}
              height={serviceImage.responsiveImage.height}
              src={serviceImage.responsiveImage.src}
              alt={serviceImage.responsiveImage.alt}
            />
          )}
        </div>
      </div>
      <div className="mb-12 lg:hidden">
        <PlaceholderImage
          width={serviceImage.responsiveImage.width}
          height={serviceImage.responsiveImage.height}
          src={serviceImage.responsiveImage.src}
          alt={serviceImage.responsiveImage.alt}
        />
      </div>
      <div className="lg:w-1/2">
        {items.map((item, index) => (
          <AccordionItem
            key={item.id}
            item={item}
            index={index}
            open={activeItem?.id === item.id}
            onClick={handleClick}
          />
        ))}
      </div>
    </div>
  );
}

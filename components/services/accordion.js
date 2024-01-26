import React, { useState, useEffect, useCallback } from 'react';
import { useAnimate } from 'framer-motion';
import clsx from 'clsx';
import { PlusIcon } from '@heroicons/react/24/outline';

import RichText from '@/components/rich-text';
import useScrollIntoView from '@/hooks/useScrollIntoView';
import PlaceholderImage from '@/components/placeholder-image';
import { useBreakpoint } from '@/hooks/tailwind';
import timeout from '@/lib/utils/timeout';

function AccordionItem({ item, index, open, onClick }) {
  const [scrollRef, setShouldScrollTo] = useScrollIntoView();
  const [bodyScope, animateBody] = useAnimate();

  const showBody = useCallback(async () => {
    await animateBody(
      bodyScope.current,
      { height: 'auto', opacity: 1 },
      { duration: 1, ease: 'easeOut' },
    );
  }, [animateBody, bodyScope]);

  const hideBody = useCallback(async () => {
    await animateBody(
      bodyScope.current,
      { height: 0, opacity: 0 },
      { duration: 1, ease: 'easeOut' },
    );
  }, [animateBody, bodyScope]);

  const handleToggle = useCallback(async () => {
    if (open) {
      await showBody();
      await setShouldScrollTo(true);
    } else {
      await hideBody();
    }
  }, [hideBody, open, setShouldScrollTo, showBody]);

  useEffect(() => {
    handleToggle();
  }, [open, handleToggle]);

  const handleClick = () => {
    onClick(item.id);
  };

  return (
    <div
      ref={scrollRef}
      className="scroll-mt-10 md:scroll-mt-24 lg:scroll-mt-48 mb-12"
    >
      <h3 className="text-xl">
        <button
          type="button"
          onClick={() => handleClick()}
          className="flex w-full justify-between items-center hover:opacity-50 transition text-left"
        >
          {index + 1}. {item.heading}
          <PlusIcon
            className={clsx(
              'shrink-0 w-6 h-6 ml-4 border rounded-full transition',
              open && 'rotate-45',
            )}
          />
        </button>
      </h3>
      <div className="h-0 opacity-0 overflow-hidden" ref={bodyScope}>
        <div className="pt-24 lg:pt-96">
          <div className="mb-8 lg:hidden">
            <PlaceholderImage
              image={item.image.responsiveImage}
              overlappingTarget
            />
          </div>
          <RichText text={item.body} />
        </div>
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
      { duration: 0.4, ease: 'easeOut' },
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
      { duration: 0.4, ease: 'easeOut' },
    );
  }, [animateImage, imageScope]);

  const handleClose = useCallback(async () => {
    if (isLgScreen && !openService) {
      await hideImage();
      setActiveItem(null);
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
      await timeout(250);
      setActiveItem(null);
      await timeout(250);
      await showImage();
      return;
    }

    await hideImage();
    await timeout(250);
    setActiveItem(items.find((item) => item.id === id));
    await timeout(250);
    await showImage();
  };

  return (
    <div className="my-8 lg:flex lg:my-6 lg:py-12">
      <div className="hidden lg:flex flex-col justify-end lg:w-1/2">
        <div className="lg:sticky bottom-0 pr-24" ref={imageScope}>
          {activeItem ? (
            <PlaceholderImage
              image={activeItem.image.responsiveImage}
              overlappingTarget
            />
          ) : (
            <PlaceholderImage
              image={serviceImage.responsiveImage}
              overlappingTarget
            />
          )}
        </div>
      </div>
      <div className="mb-12 lg:hidden">
        <PlaceholderImage
          image={serviceImage.responsiveImage}
          overlappingTarget
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

import React, { useEffect } from 'react';
import Image from 'next/image';
import clsx from 'clsx';
import { useContextSelector } from 'use-context-selector';
import AliceCarousel from 'react-alice-carousel';
import 'react-alice-carousel/lib/alice-carousel.css';

import useElementOnScreen from '@/hooks/useElementOnScreen';
import navColorContext from '@/lib/context/navColorContext';

export default function HeroSlider({ images }) {
  const [containerRef, isVisible] = useElementOnScreen({
    root: null,
    rootMargin: '0px',
    theshold: 1.0,
  });

  const setNavColor = useContextSelector(navColorContext, (v) => v[1]);

  useEffect(() => {
    if (isVisible) {
      setNavColor((s) => ({
        ...s,
        theme: 'light',
      }));
    }
    if (!isVisible) {
      setNavColor((s) => ({
        ...s,
        theme: 'dark',
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isVisible]);

  const items = images.map((image) => (
    <div key={image.id} className="relative w-full">
      <Image
        className="w-full"
        width={image.responsiveImage.width}
        height={image.responsiveImage.height}
        src={image.responsiveImage.src}
        alt={image.responsiveImage.alt}
      />
    </div>
  ));

  return (
    <>
      <div ref={containerRef} />
      <div
        className={clsx(
          isVisible ? 'visible' : 'invisible',
          'fixed top-0 w-full h-screen',
        )}
      >
        <AliceCarousel
          items={items}
          animationType="fadeout"
          autoPlay
          infinite
          autoPlayInterval={3000}
          animationDuration={1000}
        />
        <div className="absolute w-full h-[400px] top-0 bg-gradient-to-b from-black/90 z-10" />
      </div>
    </>
  );
}

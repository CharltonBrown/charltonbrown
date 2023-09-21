import React, { useEffect } from 'react';
import Image from 'next/image';
import clsx from 'clsx';
import { useContextSelector } from 'use-context-selector';
import AliceCarousel from 'react-alice-carousel';
import 'react-alice-carousel/lib/alice-carousel.css';

import navContext from '@/lib/context/navContext';

export default function HeroSlider({ images, hideHero }) {
  const setNavContext = useContextSelector(navContext, (v) => v[1]);

  useEffect(() => {
    if (!hideHero) {
      setNavContext((s) => ({
        ...s,
        logoTheme: 'light',
        linksTheme: 'light',
      }));
    }
    if (hideHero) {
      setNavContext((s) => ({
        ...s,
        logoTheme: 'dark',
        linksTheme: 'dark',
      }));
    }
  }, [hideHero, setNavContext]);

  const items = images.map((image) => (
    <div key={image.id} className="relative w-full">
      <Image
        className="w-full h-screen object-cover"
        width={image.responsiveImage.width}
        height={image.responsiveImage.height}
        src={image.responsiveImage.src}
        alt={image.responsiveImage.alt}
      />
    </div>
  ));

  return (
    <div
      className={clsx(
        hideHero ? 'invisible' : 'visible',
        'fixed w-full h-screen',
      )}
    >
      <AliceCarousel
        items={items}
        animationType="fadeout"
        autoPlay
        infinite
        autoPlayInterval={3000}
        animationDuration={1000}
        disableDotsControls
        disableButtonsControls
      />
      <div className="absolute w-full h-[400px] top-0 bg-gradient-to-b from-black/90 z-10" />
    </div>
  );
}

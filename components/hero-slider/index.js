import React, { useEffect } from 'react';
import clsx from 'clsx';
import { useContextSelector } from 'use-context-selector';
import AliceCarousel from 'react-alice-carousel';
import 'react-alice-carousel/lib/alice-carousel.css';

import navContext from '@/lib/context/navContext';
import PlaceholderImage from '@/components/placeholder-image';

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
      <PlaceholderImage
        image={image.responsiveImage}
        className="w-screen h-screen object-cover"
        layout="responsive"
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
      {/* <div className="relative w-full">
        <PlaceholderImage
          image={images[2].responsiveImage}
          className="w-screen h-screen object-cover"
          layout="responsive"
        />
      </div> */}
      <div className="absolute w-full h-[400px] top-0 bg-gradient-to-b from-black/90 z-10" />
    </div>
  );
}

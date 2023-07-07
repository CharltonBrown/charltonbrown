import React from 'react';
import Image from 'next/image';
import { Fade } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css';

export default function HeroSlider({ images }) {
  return (
    <div className="fixed top-0 w-full h-screen overflow-hidden">
      <Fade
        arrows={false}
        canSwipe={false}
        duration="2000"
        transitionDuration="2000"
      >
        {images.map((image) => (
          <div key={image.id} className="relative w-full">
            <Image
              className="object-cover"
              width={image.responsiveImage.width}
              height={image.responsiveImage.height}
              src={image.responsiveImage.src}
              alt={image.responsiveImage.alt}
            />
          </div>
        ))}
      </Fade>
      <div className="absolute w-full h-[150px] top-0 bg-gradient-to-b from-black/70 z-10" />
    </div>
  );
}

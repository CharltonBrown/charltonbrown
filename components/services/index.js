import React, { useState } from 'react';
import { useAnimate } from 'framer-motion';

import { useBreakpoint } from '@/hooks/tailwind';
import ServiceItem from '@/components/services/service-item';
import PlaceholderImage from '@/components/placeholder-image';
import timeout from '@/lib/utils/timeout';

export default function Services({ image, services }) {
  const isLgScreen = useBreakpoint('lg');
  const [openService, setOpenService] = useState('');
  const [imageScope, animateImage] = useAnimate();

  const handleClick = async (id) => {
    if (isLgScreen && openService === id) {
      await setOpenService('');
      await timeout(1000);
      await animateImage(imageScope.current, {
        display: 'block',
      });
      await animateImage(
        imageScope.current,
        { y: '0', opacity: 1 },
        { duration: 0.25 },
      );
      return;
    }

    if (isLgScreen && openService !== id) {
      await animateImage(
        imageScope.current,
        { y: '200', opacity: 0 },
        { duration: 0.25 },
      );
      await animateImage(imageScope.current, {
        display: 'none',
      });
      await setOpenService(id);
    }

    if (openService === id) {
      await setOpenService('');
      return;
    }

    await setOpenService(id);
  };

  return (
    <div className="relative mb-24 flex flex-col scroll-mt-28 md:scroll-mt-60 lg:scroll-mt-24">
      <div
        className="hidden lg:block absolute top-0 left-0 w-1/2 pr-24 mb-16"
        ref={imageScope}
      >
        <PlaceholderImage
          className="mb-4"
          width={image.responsiveImage.width}
          height={image.responsiveImage.height}
          src={image.responsiveImage.src}
          alt={image.responsiveImage.alt}
        />
      </div>
      {services.map((service) => (
        <ServiceItem
          key={service.id}
          open={openService === service.id}
          onClick={() => handleClick(service.id)}
          title={service.title}
          headline={service.headline}
          intro={service.intro}
          accordion={service.accordion}
          image={service.image}
        />
      ))}
    </div>
  );
}

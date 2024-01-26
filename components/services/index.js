import React, { useState, useEffect } from 'react';
import { useAnimate } from 'framer-motion';

import { useBreakpoint } from '@/hooks/tailwind';
import ServiceItem from '@/components/services/service-item';
import PlaceholderImage from '@/components/placeholder-image';
import timeout from '@/lib/utils/timeout';

export default function Services({ image, services }) {
  const isLgScreen = useBreakpoint('lg');
  const [openServices, setOpenServices] = useState([]);
  const [imageScope, animateImage] = useAnimate();
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = async (id) => {
    if (isAnimating) return;
    setIsAnimating(true);

    if (isLgScreen && !openServices.includes(id)) {
      await animateImage(
        imageScope.current,
        { y: '200', opacity: 0 },
        { duration: 0.25 },
      );
      await animateImage(imageScope.current, {
        display: 'none',
      });
      setOpenServices([...openServices, id]);
      setIsAnimating(false);
      return;
    }

    if (openServices.includes(id)) {
      setOpenServices(openServices.filter((item) => item !== id));
      setIsAnimating(false);
      return;
    }

    setIsAnimating(false);
    setOpenServices([...openServices, id]);
  };

  useEffect(() => {
    const animate = async () => {
      if (isLgScreen && !openServices.length) {
        await timeout(500);
        await animateImage(imageScope.current, {
          display: 'block',
        });
        await timeout(500);
        await animateImage(
          imageScope.current,
          { y: '0', opacity: 1 },
          { duration: 0.25 },
        );
      }
    };
    animate();
  }, [animateImage, imageScope, isLgScreen, openServices]);

  return (
    <div className="relative flex flex-col scroll-mt-28 md:scroll-mt-60 lg:scroll-mt-24">
      <div
        className="hidden lg:block absolute top-0 left-0 w-1/2 pr-24 mb-16"
        ref={imageScope}
      >
        <PlaceholderImage image={image.responsiveImage} overlappingTarget />
      </div>
      {services.map((service) => (
        <ServiceItem
          key={service.id}
          open={openServices.includes(service.id)}
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

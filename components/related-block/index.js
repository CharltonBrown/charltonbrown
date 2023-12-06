import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { useInView } from 'framer-motion';
import { useContextSelector } from 'use-context-selector';

import navContext from '@/lib/context/navContext';
import PlaceholderImage from '@/components/placeholder-image';

export default function RelatedBlock({
  title,
  image,
  slug,
  label,
  alwaysHideNav,
}) {
  const ref = useRef(null);
  const inView = useInView(ref);
  const setNavContext = useContextSelector(navContext, (v) => v[1]);

  useEffect(() => {
    if (alwaysHideNav) return;
    if (inView) {
      setNavContext((s) => ({
        ...s,
        navVisibility: 'hidden',
      }));
    } else {
      setNavContext((s) => ({
        ...s,
        navVisibility: 'visible',
      }));
    }
  }, [setNavContext, inView, alwaysHideNav]);

  return (
    <Link
      href={slug}
      ref={ref}
      className="block w-full h-screen flex flex-col md:flex-row"
    >
      <div className="flex flex-col justify-center h-[50vh] md:h-screen md:w-2/5 px-8 lg:px-10 xl:px-20 bg-wildSand">
        <h4 className="mb-3 text-silver">{label}</h4>
        <h3 className="text-xl md:text-3xl">{title}</h3>
      </div>
      <div className="relative h-[50vh] md:h-screen md:grow">
        <PlaceholderImage
          image={image.responsiveImage}
          className="object-cover h-full"
          fill
        />
      </div>
    </Link>
  );
}

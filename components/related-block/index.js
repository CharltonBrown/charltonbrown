import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function RelatedBlock({ title, image, slug, label }) {
  return (
    <Link
      href={slug}
      className="block w-full h-screen flex flex-col md:flex-row"
    >
      <div className="flex flex-col justify-center h-[50vh] md:h-screen md:w-2/5 px-8 lg:px-10 xl:px-20 bg-wildSand">
        <h4 className="mb-3 text-silver">{label}</h4>
        <h3 className="text-xl md:text-3xl">{title}</h3>
      </div>
      <div className="relative h-[50vh] md:h-screen md:grow">
        <Image
          src={image.responsiveImage.src}
          alt={image.responsiveImage.alt}
          fill
          className="object-cover"
        />
      </div>
    </Link>
  );
}

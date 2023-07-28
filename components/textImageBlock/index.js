import Image from 'next/image';
import React from 'react';
import clsx from 'clsx';
import FadeInBlock from '../fadeInBlock';

export default function TextImageBlock({
  heading,
  body,
  image,
  imageAlignment,
}) {
  return (
    <article>
      <FadeInBlock
        className={clsx(
          'flex flex-col gap-12 lg:flex-row lg:items-center mb-32 lg:gap-24',
          imageAlignment === 'Left' && 'lg:flex-row-reverse',
        )}
      >
        <div className="lg:w-2/5">
          <h2 className="text-4xl mb-8">{heading}</h2>
          <div
            className="text-lg"
            dangerouslySetInnerHTML={{
              __html: body,
            }}
          />
        </div>
        <div className="relative lg:w-3/5">
          <Image
            className="object-cover mb-4"
            width={image.responsiveImage.width}
            height={image.responsiveImage.height}
            src={image.responsiveImage.src}
            alt={image.responsiveImage.alt}
          />
        </div>
      </FadeInBlock>
    </article>
  );
}

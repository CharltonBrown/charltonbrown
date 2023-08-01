import React from 'react';
import Image from 'next/image';
import { EnvelopeIcon } from '@heroicons/react/24/outline';

export default function PersonInfo({ person }) {
  return (
    <div className="flex">
      <div className="relative w-[300px] min-h-[400px] mr-8">
        <Image
          className="object-cover"
          fill
          src={person.image.responsiveImage.src}
          alt={person.image.responsiveImage.alt || person.name}
        />
      </div>
      <div>
        <h2 className="text-3xl mb-2">{person.name}</h2>
        {person.qualification && (
          <h3 className="text-xl font-sans text-gray">
            {person.qualification}
          </h3>
        )}
        <h3 className="font-sans text-gray mb-2">{person.jobTitle}</h3>
        <a className="flex items-center mb-2" href={`mailto:${person.email}`}>
          <EnvelopeIcon className="w-4 h-4 mr-2" />
          {person.email}
        </a>
        <div
          className="max-w-prose font-sans text-sm"
          dangerouslySetInnerHTML={{
            __html: person.bio,
          }}
        />
      </div>
    </div>
  );
}

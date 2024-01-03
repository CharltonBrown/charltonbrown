import React from 'react';
import { EnvelopeIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';

import PlaceholderImage from '@/components/placeholder-image';
import richTextStyles from '@/components/rich-text/rich-text.module.css';
import Motif from '@/components/motif';

export default function PersonInfo({ person }) {
  return (
    <div className="flex flex-col md:flex-row">
      <div className="relative w-full md:w-[300px] md:min-h-[400px] mb-8 md:mr-8">
        <PlaceholderImage
          className="object-cover md:h-full"
          image={person.image.responsiveImage}
        />
      </div>
      <div>
        <div className="flex items-start mb-4">
          {person.motif && (
            <Motif
              className="w-11 h-11 mr-4 mb-4 shrink-0"
              motifId={person.motif.motifId}
            />
          )}
          <div className="flex flex-col">
            <h2 className="text-3xl">{person.name}</h2>
            {person.qualification && (
              <h3 className="text-xl font-sans text-gray">
                {person.qualification}
              </h3>
            )}
            <h3 className="text-silver mb-2">{person.jobTitle}</h3>
          </div>
        </div>
        <a className="flex items-center mb-2" href={`mailto:${person.email}`}>
          <EnvelopeIcon className="w-4 h-4 mr-2" />
          {person.email}
        </a>
        <div
          className={clsx(
            richTextStyles.richText,
            'max-w-prose font-sans text-sm',
          )}
          dangerouslySetInnerHTML={{
            __html: person.bio,
          }}
        />
      </div>
    </div>
  );
}

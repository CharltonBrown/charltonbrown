import React, { useState } from 'react';
import Image from 'next/image';

import Modal from '@/components/modal';
import PersonInfo from '@/components/person-info';
import FadeInBlock from '@/components/fade-in-block';
import PlaceholderImage from '@/components/placeholder-image';

export default function PeopleGrid({ people }) {
  const [activePersonId, setActivePersonId] = useState('');
  const handleClick = (id) => {
    if (activePersonId === id) {
      setActivePersonId('');
    } else {
      setActivePersonId(id);
    }
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 grid-flow-dense auto-cols-[repeat(auto-fit, 20rem)]">
      {people.map((person) => (
        <FadeInBlock key={person.id}>
          <div
            className="text-left mb-12"
            onClick={() => handleClick(person.id)}
            onKeyDown={() => handleClick(person.id)}
            role="button"
            tabIndex="0"
          >
            <div className="relative w-full mb-4">
              <PlaceholderImage
                src={person.image.responsiveImage.src}
                alt={person.image.responsiveImage.alt || person.name}
                width={0}
                height={0}
                sizes="100vw"
                className="w-full h-auto"
                hoverEffect
              />
            </div>
            <div className="flex items-start">
              {person.motif && (
                <Image
                  src={person.motif.svg.url}
                  width={44}
                  height={44}
                  alt={`${person.text} icon`}
                  className="border border-black mr-4 mb-4 shrink-0"
                />
              )}
              <div className="flex flex-col">
                <h3 className="text-silver">{person.jobTitle}</h3>
                <h2 className="text-xl">{person.name}</h2>
              </div>
            </div>
          </div>
          <Modal
            isOpen={activePersonId === person.id}
            setIsOpen={() => handleClick(person.id)}
          >
            <PersonInfo person={person} />
          </Modal>
        </FadeInBlock>
      ))}
    </div>
  );
}

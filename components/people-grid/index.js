import React, { useState } from 'react';

import Modal from '@/components/modal';
import PersonInfo from '@/components/person-info';
import FadeInBlock from '@/components/fade-in-block';
import PlaceholderImage from '@/components/placeholder-image';
import Motif from '@/components/motif';

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
    <div className="xs:grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10 grid-flow-dense auto-cols-[repeat(auto-fit, 20rem)]">
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
                image={person.image.responsiveImage}
                className="w-full h-auto"
                hoverEffect
                overlappingTarget
              />
            </div>
            <div className="flex items-start">
              {person.motif && (
                <Motif
                  className="w-11 h-11 mr-4 mb-4 shrink-0"
                  motifId={person.motif.motifId}
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

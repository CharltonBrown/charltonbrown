import React, { useState } from 'react';
import Image from 'next/image';

import Modal from '@/components/modal';
import PersonInfo from '@/components/personInfo';

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
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 grid-flow-dense auto-cols-[repeat(auto-fit, 20rem)]">
      {people.map((person) => (
        <>
          <div
            className="text-left"
            onClick={() => handleClick(person.id)}
            onKeyDown={() => handleClick(person.id)}
            role="button"
            tabIndex="0"
          >
            <div className="relative w-full min-h-[200px] md:min-h-[300px] lg:min-h-[400px] mb-4">
              <Image
                className="object-cover"
                fill
                src={person.image.responsiveImage.src}
                alt={person.image.responsiveImage.alt}
              />
            </div>
            <div className="flex flex-col">
              <h2 className="text-2xl">{person.name}</h2>
            </div>
          </div>
          <Modal
            isOpen={activePersonId === person.id}
            setIsOpen={() => handleClick(person.id)}
          >
            <PersonInfo person={person} />
          </Modal>
        </>
      ))}
    </div>
  );
}

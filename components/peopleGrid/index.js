import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

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

  const bgVariants = {
    active: {
      backgroundColor: '#FAF9F9',
      border: '1px solid #BBBBBB',
      transition: { duration: 0.4 },
    },
    inactive: {
      transition: { duration: 0.4 },
    },
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 grid-flow-dense auto-cols-[repeat(auto-fit, 20rem)]">
      {people.map((person) => (
        <>
          <motion.div
            className="text-left p-6"
            onClick={() => handleClick(person.id)}
            variants={bgVariants}
            animate={activePersonId === person.id ? 'active' : 'inactive'}
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
          </motion.div>
          <AnimatePresence key={person.id} mode="wait">
            {activePersonId === person.id && (
              <motion.div
                className="col-span-full p-6"
                key={person.id}
                initial={{
                  opacity: 0,
                  scale: 0.75,
                  backgroundColor: 'transparent',
                  border: 0,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  backgroundColor: '#FAF9F9',
                  border: '1px solid #BBBBBB',
                  transition: {
                    ease: 'easeOut',
                    duration: 0.15,
                  },
                }}
                exit={{
                  opacity: 0,
                  scale: 0.75,
                  backgroundColor: 'transparent',
                  border: 0,
                  transition: {
                    ease: 'easeIn',
                    duration: 0.15,
                  },
                }}
              >
                <PersonInfo person={person} />
              </motion.div>
            )}
          </AnimatePresence>
        </>
      ))}
    </div>
  );
}

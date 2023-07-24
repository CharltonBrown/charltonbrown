import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import Link from 'next/link';
import Image from 'next/image';
import { v4 as uuidv4 } from 'uuid';
import { motion, LayoutGroup } from 'framer-motion';

export default function OddEvenGrid({ items, parentSlug, type }) {
  const chunkSize = 2;
  const [chunks, setChunks] = useState([]);

  useEffect(() => {
    const newChunks = [];
    for (let i = 0; i < items.length; i += chunkSize) {
      const chunk = {
        id: uuidv4(),
        items: items.slice(i, i + chunkSize),
      };
      newChunks.push(chunk);
    }
    setChunks(newChunks);
  }, [items]);

  return (
    <LayoutGroup>
      {chunks.map((chunk) => (
        <motion.div
          className={clsx(
            chunk.items.length > 1 && 'items-center',
            'md:flex flex-nowrap gap-16 overflow-hidden',
          )}
          key={chunk.id}
          layout
          initial={{ opacity: 0, y: '100px' }}
          animate={{
            opacity: 1,
            y: '0',
            transition: {
              ease: 'easeInOut',
              duration: 1,
            },
          }}
          exit={{ opacity: 0, y: '100px' }}
        >
          {chunk.items.map((item) => {
            const metaLabel = {
              projects: item.projectType?.typeTitle,
              // eslint-disable-next-line no-underscore-dangle
              journal: `Journal -- ${new Date(item._createdAt).getFullYear()}`,
            };
            return (
              <article
                key={item.id}
                className="odd:w-[calc(50%+1.5rem)] even:w-[calc(50%-1.5rem)] mb-12"
              >
                <Link href={`/${parentSlug}/${item.slug}`}>
                  <Image
                    className="object-cover mb-4"
                    width={item.mainImage.responsiveImage.width}
                    height={item.mainImage.responsiveImage.height}
                    src={item.mainImage.responsiveImage.src}
                    alt={item.mainImage.responsiveImage.alt}
                  />
                  <div className="flex flex-col">
                    <h3 className="mb-1 text-gray">{metaLabel[type]}</h3>
                    <h2 className="text-3xl">{item.title}</h2>
                  </div>
                </Link>
              </article>
            );
          })}
        </motion.div>
      ))}
    </LayoutGroup>
  );
}

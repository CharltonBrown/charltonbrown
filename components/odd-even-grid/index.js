/* eslint-disable no-underscore-dangle */
import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import Link from 'next/link';
import Image from 'next/image';
import { v4 as uuidv4 } from 'uuid';

import PlaceholderImage from '@/components/placeholder-image';
import FadeInBlock from '@/components/fade-in-block';
import FootnoteTwo from '@/components/icons/footnotes/footnote-2';

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
    <>
      {chunks.map((chunk, index) => {
        const chunkClass =
          index % 2 === 0
            ? 'lg:even:w-[calc(55%+1.5rem)] lg:odd:w-[calc(45%-1.5rem)]'
            : 'lg:odd:w-[calc(55%+1.5rem)] lg:even:w-[calc(45%-1.5rem)]';
        return (
          <FadeInBlock
            className={clsx(
              chunk.items.length > 1 && 'items-center',
              'md:flex flex-nowrap gap-20 overflow-hidden lg:mb-32 lg:gap-24',
            )}
            key={chunk.id}
          >
            {chunk.items.map((item) => {
              return (
                <article key={item.id} className={clsx(chunkClass, 'mb-24')}>
                  <Link
                    href={`/${parentSlug}/[slug]`}
                    as={`/${parentSlug}/${item.slug}`}
                  >
                    <PlaceholderImage
                      className="object-cover"
                      width={item.mainImage.responsiveImage.width}
                      height={item.mainImage.responsiveImage.height}
                      src={item.mainImage.responsiveImage.src}
                      alt={item.mainImage.responsiveImage.alt}
                      hoverEffect
                    />
                    <div className="flex items-star mt-4">
                      {item.motif && (
                        <Image
                          src={item.motif.svg.url}
                          width={60}
                          height={60}
                          alt={`${item.text} icon`}
                          className="border border-black mr-4 mb-4 shrink-0"
                        />
                      )}
                      <div className="flex flex-col">
                        {type === 'journal' && (
                          <h3 className="mb-1 text-gray">
                            Journal -- {new Date(item._createdAt).getFullYear()}
                          </h3>
                        )}
                        <h2 className="text-2xl">{item.title}</h2>
                        {item.intro && (
                          <div className="flex items-start pl-1 lg:pl-8">
                            <FootnoteTwo className="block w-4 h-4 shrink-0 mt-1 mr-4" />
                            <div
                              className="font-sans text-sm"
                              dangerouslySetInnerHTML={{
                                __html: item.intro,
                              }}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                </article>
              );
            })}
          </FadeInBlock>
        );
      })}
    </>
  );
}

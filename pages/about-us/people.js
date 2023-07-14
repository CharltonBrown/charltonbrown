import React from 'react';
import { useQuerySubscription } from 'react-datocms';
import Image from 'next/image';

import request from '@/lib/datocms';
import Layout from '@/components/layout';
import { responsiveImageFragment } from '@/lib/fragments';
import mainNavigationFragment from '@/components/navigation/fragment';
import footerNavigationFragment from '@/components/footerNavigation/fragment';

export async function getStaticProps({ preview = false }) {
  const graphqlRequest = {
    query: `
          query peoplePageContent {
            allPeople {
              email
              id
              jobTitle
              mobile
              name
              phone
              position
              image {
                responsiveImage(imgixParams: {fm: jpg, w: 500 }) {
                  ...responsiveImageFragment
                }
              }
            }
            ${mainNavigationFragment}
            ${footerNavigationFragment}
          }
          ${responsiveImageFragment}
        `,
    preview,
  };

  return {
    props: {
      subscription: preview
        ? {
            ...graphqlRequest,
            initialData: await request(graphqlRequest),
            token: process.env.CMS_DATOCMS_API_TOKEN,
          }
        : {
            enabled: false,
            initialData: await request(graphqlRequest),
          },
    },
  };
}

export default function People({ subscription }) {
  const {
    data: { allPeople: people, mainNavigation, footerNavigation },
  } = useQuerySubscription(subscription);

  console.log({ people });

  return (
    <Layout
      mainNavigation={mainNavigation.links}
      footerNavigation={footerNavigation.links}
    >
      <h1 className="sr-only">People</h1>

      <div className="p-8">
        <div className="flex">
          <aside className="w-[220px] h-screen sticky top-0 flex flex-col justify-center">
            <nav>
              <ul className="flex flex-col">
                <li>
                  <button type="button" className="text-xl text-silver ">
                    About us
                  </button>
                </li>
                <li>
                  <button type="button" className="text-xl text-silver ">
                    People
                  </button>
                </li>
                <li>
                  <button type="button" className="text-xl text-silver ">
                    Journal
                  </button>
                </li>
                <li>
                  <button type="button" className="text-xl text-silver ">
                    Careers
                  </button>
                </li>
              </ul>
            </nav>
          </aside>
          <div className="pt-[200px] pl-8 grid grid-cols-4 gap-12">
            {people.map((person) => (
              <article key={person.id} className="mb-4">
                <Image
                  className="object-cover mb-4"
                  width={person.image.responsiveImage.width}
                  height={person.image.responsiveImage.height}
                  src={person.image.responsiveImage.src}
                  alt={person.image.responsiveImage.alt}
                />
                <div className="flex flex-col">
                  <h2 className="text-2xl">{person.name}</h2>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}

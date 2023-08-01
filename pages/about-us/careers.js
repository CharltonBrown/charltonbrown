import React from 'react';
import { useQuerySubscription } from 'react-datocms';

import request from '@/lib/datocms';
import Layout from '@/components/layout';
import AboutUsNav from '@/components/about-us-navigation';
import TextImageBlock from '@/components/text-image-block';
import { responsiveImageFragment } from '@/lib/fragments';
import mainNavigationFragment from '@/components/navigation/fragment';
import footerNavigationFragment from '@/components/legal-navigation/fragment';
import aboutUsNavigationFragment from '@/lib/fragments/about-us-navigation';

export async function getStaticProps({ preview = false }) {
  const graphqlRequest = {
    query: `
          query careersPageContent {
            careersPage {
              textImageBlock {
                id
                body
                heading
                id
                imageAlignment
                image {
                  responsiveImage(imgixParams: {fm: jpg, w: 1000 }) {
                    ...responsiveImageFragment
                  }
                }
              }
            }
            ${aboutUsNavigationFragment}
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

export default function Careers({ subscription }) {
  const {
    data: { careersPage, mainNavigation, footerNavigation, aboutUsNavigation },
  } = useQuerySubscription(subscription);

  console.log({ careersPage });

  return (
    <Layout
      mainNavigation={mainNavigation.links}
      footerNavigation={footerNavigation.links}
    >
      <main className="bg-white">
        <h1 className="sr-only">Careers</h1>
        <div className="p-8">
          <div className="flex">
            <aside className="w-[320px] shrink-0 h-screen sticky top-0 flex flex-col justify-center">
              <AboutUsNav links={aboutUsNavigation.links} />
            </aside>
            <div className="pt-[200px] pl-8 grow">
              {careersPage?.textImageBlock.map((block) => (
                <TextImageBlock
                  key={block.id}
                  body={block.body}
                  heading={block.heading}
                  image={block.image}
                  imageAlignment={block.imageAlignment}
                />
              ))}
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
}

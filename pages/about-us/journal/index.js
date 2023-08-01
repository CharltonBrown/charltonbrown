import React from 'react';
import { useQuerySubscription } from 'react-datocms';

import request from '@/lib/datocms';
import Layout from '@/components/layout';
import AboutUsNav from '@/components/aboutUsNav';
import OddEvenGrid from '@/components/oddEvenGrid';
import { responsiveImageFragment } from '@/lib/fragments';
import mainNavigationFragment from '@/components/navigation/fragment';
import footerNavigationFragment from '@/components/footerNavigation/fragment';
import aboutUsNavigationFragment from '@/lib/fragments/about-us-navigation';

export async function getStaticProps({ preview = false }) {
  const graphqlRequest = {
    query: `
          query journalContent {
            allPosts {
              id
              body {
                value
              }
              mainImage {
                responsiveImage(imgixParams: {fm: jpg, w: 1000 }) {
                  ...responsiveImageFragment
                }
              }
              title
              slug
              _createdAt
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

export default function Posts({ subscription }) {
  const {
    data: {
      allPosts: posts,
      mainNavigation,
      footerNavigation,
      aboutUsNavigation,
    },
  } = useQuerySubscription(subscription);

  return (
    <Layout
      mainNavigation={mainNavigation.links}
      footerNavigation={footerNavigation.links}
    >
      <main className="bg-white">
        <h1 className="sr-only">Journal</h1>
        <div className="p-8">
          <div className="flex">
            <aside className="w-[320px] shrink-0 h-screen sticky top-0 flex flex-col justify-center">
              <AboutUsNav links={aboutUsNavigation.links} />
            </aside>
            <div className="pt-[200px] pl-8 grow">
              <OddEvenGrid
                items={posts}
                parentSlug="about-us/journal"
                type="journal"
              />
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
}

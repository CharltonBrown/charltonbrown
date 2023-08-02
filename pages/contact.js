import React from 'react';
import { useQuerySubscription } from 'react-datocms';

import request from '@/lib/datocms';
import Layout from '@/components/layout';
import { responsiveImageFragment } from '@/lib/fragments';
import mainNavigationFragment from '@/components/navigation/fragment';
import legalNavigationFragment from '@/components/legal-navigation/fragment';

export async function getStaticProps({ preview = false }) {
  const graphqlRequest = {
    query: `
          query contactPageContent {
            contact {
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
            ${mainNavigationFragment}
            ${legalNavigationFragment}
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

export default function Contact({ subscription }) {
  const {
    data: { contact, mainNavigation, legalNavigation },
  } = useQuerySubscription(subscription);

  console.log({ contact });

  return (
    <Layout
      mainNavigation={mainNavigation.links}
      legalNavigation={legalNavigation.links}
    >
      <main className="bg-white">
        <h1 className="sr-only">Contact us</h1>
      </main>
    </Layout>
  );
}

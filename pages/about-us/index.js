import React from 'react';
import { useQuerySubscription } from 'react-datocms';

import request from '@/lib/datocms';
import Layout from '@/components/layout';
import mainNavigationFragment from '@/components/navigation/fragment';
import footerNavigationFragment from '@/components/footerNavigation/fragment';

export async function getStaticProps({ preview = false }) {
  const graphqlRequest = {
    query: `
          query aboutPageContent {
            about {
              aboutModularContent {
                body
                heading
              }
            }
            ${mainNavigationFragment}
            ${footerNavigationFragment}
          }          
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

export default function About({ subscription }) {
  const {
    data: { about, mainNavigation, footerNavigation },
  } = useQuerySubscription(subscription);

  console.log({ about });

  return (
    <Layout
      mainNavigation={mainNavigation.links}
      footerNavigation={footerNavigation.links}
    >
      <div className="p-8">about</div>
    </Layout>
  );
}

import React from 'react';
import { useQuerySubscription } from 'react-datocms';

import request from '@/lib/datocms';
import Layout from '@/components/layout';

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
    data: { about },
  } = useQuerySubscription(subscription);

  console.log({ about });

  return (
    <Layout>
      <div className="p-8">about</div>
    </Layout>
  );
}

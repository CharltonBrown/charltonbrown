import React from 'react';
import { useQuerySubscription } from 'react-datocms';

import request from '@/lib/datocms';
import Layout from '@/components/layout';

export async function getStaticProps({ preview = false }) {
  const graphqlRequest = {
    query: `
          query careersPageContent {
            careers {
              
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

export default function Careers({ subscription }) {
  const {
    data: { careers },
  } = useQuerySubscription(subscription);

  console.log({ careers });

  return (
    <Layout>
      <div className="p-8">careers</div>
    </Layout>
  );
}

import React from 'react';
import { useQuerySubscription } from 'react-datocms';

import request from '@/lib/datocms';
import Layout from '@/components/layout';

export async function getStaticPaths() {
  const data = await request({ query: '{ allService { slug } }' });

  return {
    paths: data.allServices.map((post) => `/services/${post.slug}`),
    fallback: false,
  };
}

export async function getStaticProps({ params, preview = false }) {
  const graphqlRequest = {
    query: `
          query ServicesBySlug($slug: String) {
            services(filter: {slug: {eq: $slug}}) {
              id
              description
              slug
              title
            }
          }          
        `,
    preview,
    variables: {
      slug: params.slug,
    },
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

export default function Service({ subscription }) {
  const {
    data: { service },
  } = useQuerySubscription(subscription);

  console.log({ service });

  return (
    <Layout>
      <div className="p-8">service</div>
    </Layout>
  );
}

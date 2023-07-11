import React from 'react';
import { useQuerySubscription } from 'react-datocms';

import request from '@/lib/datocms';
import Layout from '@/components/layout';
import mainNavigationFragment from '@/components/navigation/fragment';
import footerNavigationFragment from '@/components/footerNavigation/fragment';

export async function getStaticPaths() {
  const data = await request({ query: '{ allServices { slug } }' });

  return {
    paths: data.allServices.map((service) => `/services/${service.slug}`),
    fallback: false,
  };
}

export async function getStaticProps({ params, preview = false }) {
  const graphqlRequest = {
    query: `
          query ServicesBySlug($slug: String) {
            services(filter: {slug: {eq: $slug}}) {
              id
              title
            }
            ${mainNavigationFragment}
            ${footerNavigationFragment}
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
    data: { service, mainNavigation, footerNavigation },
  } = useQuerySubscription(subscription);

  console.log({ service });

  return (
    <Layout
      mainNavigation={mainNavigation.links}
      footerNavigation={footerNavigation.links}
    >
      <div className="p-8">service</div>
    </Layout>
  );
}

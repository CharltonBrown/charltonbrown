import React from 'react';
import { useQuerySubscription } from 'react-datocms';
import Link from 'next/link';

import request from '@/lib/datocms';
import Layout from '@/components/layout';
import mainNavigationFragment from '@/components/navigation/fragment';
import footerNavigationFragment from '@/components/footerNavigation/fragment';

export async function getStaticProps({ preview = false }) {
  const graphqlRequest = {
    query: `
          query ServicesQuery {
            allServices {
              id
              slug
              title
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

export default function Services({ subscription }) {
  const {
    data: { allServices: services, mainNavigation, footerNavigation },
  } = useQuerySubscription(subscription);

  console.log({ services });

  return (
    <Layout
      mainNavigation={mainNavigation.links}
      footerNavigation={footerNavigation.links}
    >
      <div className="relative bg-black p-8 text-white mt-[300px] z-50">
        <ul>
          {services.map((service) => (
            <li key={service.id}>
              <Link href={`/services/${service.slug}`}>{service.title}</Link>
            </li>
          ))}
        </ul>
      </div>
    </Layout>
  );
}

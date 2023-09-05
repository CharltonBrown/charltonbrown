import React from 'react';
import { useQuerySubscription } from 'react-datocms';

import request from '@/lib/datocms';
import Layout from '@/components/layout';
import { responsiveImageFragment } from '@/lib/fragments';
import ServiceBlock from '@/components/service-block';

import useLayoutQuery from '@/hooks/useLayoutQuery';
import navigationFragment from '@/lib/fragments/navigation-fragment';

export async function getStaticProps({ preview = false }) {
  const graphqlRequest = {
    query: `
          query ServicesQuery {
            servicesPage {
              serviceBlocks {
                id
                introHeading
                intro(markdown: true)
                image {
                  responsiveImage(imgixParams: {fm: jpg, w: 2000 }) {
                    ...responsiveImageFragment
                  }
                }
                title
                steps {
                  title
                  id
                  body(markdown: true)
                }
              }
            }
            ${navigationFragment}
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

export default function Services({ subscription }) {
  const {
    data: {
      servicesPage: { serviceBlocks },
    },
  } = useQuerySubscription(subscription);
  const navigation = useLayoutQuery(subscription);

  return (
    <Layout navigation={navigation} title="Services">
      <main className="bg-white">
        <h1 className="sr-only">Services</h1>
        <div className="relative">
          {serviceBlocks.map((service) => (
            <ServiceBlock
              key={service.id}
              title={service.title}
              intro={service.intro}
              introHeading={service.introHeading}
              body={service.body}
              steps={service.steps}
              image={service.image}
            />
          ))}
        </div>
      </main>
    </Layout>
  );
}

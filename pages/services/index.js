import React, { useState } from 'react';
import { useQuerySubscription } from 'react-datocms';

import request from '@/lib/datocms';
import Layout from '@/components/layout';
import mainNavigationFragment from '@/components/navigation/fragment';
import footerNavigationFragment from '@/components/footerNavigation/fragment';
import ServiceBlock from '@/components/serviceBlock';

export async function getStaticProps({ preview = false }) {
  const graphqlRequest = {
    query: `
          query ServicesQuery {
            servicesPage {
              serviceBlocks {
                id
                intro
                body
                title
                steps {
                  title
                  id
                }
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

export default function Services({ subscription }) {
  const {
    data: {
      servicesPage: { serviceBlocks },
      mainNavigation,
      footerNavigation,
    },
  } = useQuerySubscription(subscription);
  const [activeService, setActiveService] = useState('');

  const handleClick = (id) => {
    if (id === activeService) {
      setActiveService('');
      return;
    }
    setActiveService(id);
  };

  return (
    <Layout
      mainNavigation={mainNavigation.links}
      footerNavigation={footerNavigation.links}
    >
      <div className="relative p-8 pt-[200px]">
        {serviceBlocks.map((service) => (
          <ServiceBlock
            key={service.id}
            title={service.title}
            intro={service.intro}
            body={service.body}
            steps={service.steps}
            onClick={() => handleClick(service.id)}
            open={activeService === service.id}
          />
        ))}
      </div>
    </Layout>
  );
}

import React, { useState } from 'react';
import { useQuerySubscription } from 'react-datocms';

import request from '@/lib/datocms';
import Layout from '@/components/layout';
import mainNavigationFragment from '@/components/navigation/fragment';
import footerFragment from '@/components/footer/fragment';
import legalNavigationFragment from '@/components/legal-navigation/fragment';
import { responsiveImageFragment } from '@/lib/fragments';
import ServiceBlock from '@/components/service-block';
import Container from '@/components/container';

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
                  body(markdown: true)
                  image {
                    responsiveImage(imgixParams: {fm: jpg, w: 500, h: 500, fit: crop }) {
                      ...responsiveImageFragment
                    }
                  }
                }
              }
            }
            ${mainNavigationFragment}
            ${footerFragment}
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

export default function Services({ subscription }) {
  const {
    data: {
      servicesPage: { serviceBlocks },
      mainNavigation,
      footer,
      legalNavigation,
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
      legalNavigation={legalNavigation.links}
      footer={footer}
    >
      <main className="bg-white">
        <h1 className="sr-only">Services</h1>
        <Container>
          <div className="relative pt-[200px]">
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
        </Container>
      </main>
    </Layout>
  );
}

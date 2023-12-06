import React from 'react';
import { useQuerySubscription } from 'react-datocms';

import request from '@/lib/datocms';
import Layout from '@/components/layout';
import ContentGutter from '@/components/content-gutter';
import Container from '@/components/container';
import Services from '@/components/services';
import { responsiveImageFragment } from '@/lib/fragments';
import useLayoutQuery from '@/hooks/useLayoutQuery';
import navigationFragment from '@/lib/fragments/navigation-fragment';
import globalSeoFragment from '@/lib/fragments/global-seo';

export async function getStaticProps({ preview = false }) {
  const graphqlRequest = {
    query: `
          query ServicesQuery {
            ${globalSeoFragment}
            servicesPage {
              seo {
                description
                title
              }
              image {
                responsiveImage(imgixParams: {fm: jpg, w: 900 }) {
                  ...responsiveImageFragment
                }
              }
              services {
                id
                title
                headline
                intro
                image {
                  responsiveImage(imgixParams: {fm: jpg, w: 900 }) {
                    ...responsiveImageFragment
                  }
                }
                accordion {
                  id
                  heading
                  body {
                    value
                  }
                  image {
                    responsiveImage(imgixParams: {fm: jpg, w: 900 }) {
                      ...responsiveImageFragment
                    }
                  }
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

export default function ServicesPage({ subscription }) {
  const {
    data: {
      _site: { globalSeo },
      servicesPage: { seo, image, services },
    },
  } = useQuerySubscription(subscription);
  const navigation = useLayoutQuery(subscription);

  return (
    <Layout
      navigation={navigation}
      globalSeo={globalSeo}
      seo={seo}
      hiddenPageHeading
    >
      <main className="bg-white relative min-h-screen pb-24">
        <Container>
          <ContentGutter>
            <Services image={image} services={services} />
          </ContentGutter>
        </Container>
      </main>
    </Layout>
  );
}

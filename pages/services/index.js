import React from 'react';
import { useQuerySubscription } from 'react-datocms';

import request from '@/lib/datocms';
import Layout from '@/components/layout';
import ContentGutter from '@/components/content-gutter';
import Container from '@/components/container';
import Services from '@/components/services';
import useLayoutQuery from '@/hooks/useLayoutQuery';
import {
  responsiveImageFragment,
  metaTagsFragment,
  navigationFragment,
  globalSeoFragment,
} from '@/lib/fragments';

export async function getStaticProps({ preview = false }) {
  const graphqlRequest = {
    query: `
          query ServicesQuery {
            ${globalSeoFragment}
            servicesPage {
              seo: _seoMetaTags {
                ...metaTagsFragment
              }
              image {
                responsiveImage(imgixParams: {auto: format, w: 1200 }) {
                  ...responsiveImageFragment
                }
              }
              services {
                id
                title
                headline
                intro
                image {
                  responsiveImage(imgixParams: {auto: format, w: 1200 }) {
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
                    responsiveImage(imgixParams: {auto: format, w: 1200 }) {
                      ...responsiveImageFragment
                    }
                  }
                }
              }
            }
            ${navigationFragment}
          }
          ${metaTagsFragment}
          ${responsiveImageFragment}
        `,
    preview,
    includeDrafts: preview,
  };

  return {
    props: {
      subscription: preview
        ? {
            ...graphqlRequest,
            initialData: await request(graphqlRequest),
            token: process.env.NEXT_DATOCMS_API_TOKEN,
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
      site,
      servicesPage: { seo, image, services },
    },
  } = useQuerySubscription(subscription);
  const { navigation, preview } = useLayoutQuery(subscription);

  return (
    <Layout
      navigation={navigation}
      preview={preview}
      site={site}
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

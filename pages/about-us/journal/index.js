import React from 'react';
import { useQuerySubscription } from 'react-datocms';

import request from '@/lib/datocms';
import Layout from '@/components/layout';
import OddEvenGrid from '@/components/odd-even-grid';
import Container from '@/components/container';
import ContentGutter from '@/components/content-gutter';
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
          query journalContent {
            ${globalSeoFragment}
            listPagesSeo(filter: {page: {eq: "Journal"}}) {
              seo: _seoMetaTags {
                ...metaTagsFragment
              }
            }
            allPosts(first: 100, orderBy: _createdAt_DESC) {
              id
              body {
                value
              }
              mainImage {
                responsiveImage(imgixParams: {auto: format, w: 1000 }) {
                  ...responsiveImageFragment
                }
              }
              title
              slug
              _createdAt
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

export default function Posts({ subscription }) {
  const {
    data: { site, allPosts: posts, listPagesSeo },
  } = useQuerySubscription(subscription);
  const { navigation, preview } = useLayoutQuery(subscription);

  return (
    <Layout
      site={site}
      seo={listPagesSeo.seo}
      navigation={navigation}
      preview={preview}
      hiddenPageHeading
    >
      <main className="bg-white">
        <Container>
          <ContentGutter>
            <OddEvenGrid
              items={posts}
              parentSlug="about-us/journal"
              type="journal"
            />
          </ContentGutter>
        </Container>
      </main>
    </Layout>
  );
}

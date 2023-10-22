import React from 'react';
import { useQuerySubscription } from 'react-datocms';

import request from '@/lib/datocms';
import Layout from '@/components/layout';
import OddEvenGrid from '@/components/odd-even-grid';
import Container from '@/components/container';
import ContentGutter from '@/components/content-gutter';
import { responsiveImageFragment } from '@/lib/fragments';
import useLayoutQuery from '@/hooks/useLayoutQuery';
import navigationFragment from '@/lib/fragments/navigation-fragment';

export async function getStaticProps({ preview = false }) {
  const graphqlRequest = {
    query: `
          query journalContent {
            allPosts {
              id
              body {
                value
              }
              mainImage {
                responsiveImage(imgixParams: {fm: jpg, w: 1000 }) {
                  ...responsiveImageFragment
                }
              }
              title
              slug
              _createdAt
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

export default function Posts({ subscription }) {
  const {
    data: { allPosts: posts },
  } = useQuerySubscription(subscription);
  const navigation = useLayoutQuery(subscription);

  return (
    <Layout navigation={navigation} title="Journal">
      <main className="bg-white">
        <h1 className="sr-only">Journal</h1>
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

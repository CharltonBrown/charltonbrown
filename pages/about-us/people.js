/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';
import { useQuerySubscription } from 'react-datocms';

import request from '@/lib/datocms';
import Layout from '@/components/layout';
import PeopleGrid from '@/components/people-grid';
import { responsiveImageFragment } from '@/lib/fragments';
import Container from '@/components/container';
import ContentGutter from '@/components/content-gutter';
import globalSeoFragment from '@/lib/fragments/global-seo';

import useLayoutQuery from '@/hooks/useLayoutQuery';
import navigationFragment from '@/lib/fragments/navigation-fragment';

export async function getStaticProps({ preview = false }) {
  const graphqlRequest = {
    query: `
          query peoplePageContent {
            ${globalSeoFragment}
            allPeople(first: 100) {
              email
              id
              jobTitle
              qualification
              bio(markdown: true)
              mobile
              name
              phone
              image {
                responsiveImage(imgixParams: {auto: format, fit: crop, w: 600, h: 800 }) {
                  ...responsiveImageFragment
                }
              }
              motif {
                motifId
              }
            }
            ${navigationFragment}
          }
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

export default function People({ subscription }) {
  const {
    data: { _site: site, allPeople: people },
  } = useQuerySubscription(subscription);
  const { navigation, preview } = useLayoutQuery(subscription);

  const seo = {
    title: 'People',
    description: 'We are a team of 20 passionate architects and designers.',
  };

  return (
    <Layout
      navigation={navigation}
      preview={preview}
      seo={seo}
      site={site}
      hiddenPageHeading
    >
      <main className="bg-white">
        <Container>
          <ContentGutter>
            <PeopleGrid people={people} />
          </ContentGutter>
        </Container>
      </main>
    </Layout>
  );
}

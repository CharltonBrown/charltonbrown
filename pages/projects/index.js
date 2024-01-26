import React from 'react';
import { useQuerySubscription } from 'react-datocms';

import request from '@/lib/datocms';
import Layout from '@/components/layout';
import Container from '@/components/container';
import OddEvenGrid from '@/components/odd-even-grid';
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
          query ProjectsQuery {
            ${globalSeoFragment}
            listPagesSeo(filter: {page: {eq: "Projects"}}) {
              seo: _seoMetaTags {
                ...metaTagsFragment
              }
            }
            allProjects(first: 100) {
              id
              slug
              title
              mainImage {
                responsiveImage(imgixParams: {auto: format, w: 1000 }) {
                  ...responsiveImageFragment
                }
              }
              intro {
                value
              }
              projectType {
                id
                typeTitle
              }
              motif {
                motifId
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

export default function Projects({ subscription }) {
  const {
    data: { site, allProjects: projects, listPagesSeo },
  } = useQuerySubscription(subscription);
  const { navigation, preview } = useLayoutQuery(subscription);

  return (
    <Layout
      navigation={navigation}
      preview={preview}
      site={site}
      seo={listPagesSeo.seo}
      hiddenPageHeading
    >
      <main className="bg-white">
        <Container>
          <ContentGutter>
            <OddEvenGrid
              items={projects}
              parentSlug="projects"
              type="projects"
            />
          </ContentGutter>
        </Container>
      </main>
    </Layout>
  );
}

import React from 'react';
import { useQuerySubscription } from 'react-datocms';

import request from '@/lib/datocms';
import Layout from '@/components/layout';
import { responsiveImageFragment } from '@/lib/fragments';
import Container from '@/components/container';
import OddEvenGrid from '@/components/odd-even-grid';
import ContentGutter from '@/components/content-gutter';

import useLayoutQuery from '@/hooks/useLayoutQuery';
import navigationFragment from '@/lib/fragments/navigation-fragment';
import globalSeoFragment from '@/lib/fragments/global-seo';

export async function getStaticProps({ preview = false }) {
  const graphqlRequest = {
    query: `
          query ProjectsQuery {
            ${globalSeoFragment}
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

export default function Projects({ subscription }) {
  const {
    data: { _site: site, allProjects: projects },
  } = useQuerySubscription(subscription);
  const navigation = useLayoutQuery(subscription);

  const seo = {
    title: 'Projects',
    description: 'A selection of projects by Charlton Brown.',
  };

  return (
    <Layout navigation={navigation} site={site} seo={seo} hiddenPageHeading>
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

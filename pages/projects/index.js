import React from 'react';
import { useQuerySubscription } from 'react-datocms';

import request from '@/lib/datocms';
import Layout from '@/components/layout';
import ProjectsGrid from '@/components/projects-grid';
import { responsiveImageFragment } from '@/lib/fragments';
import Container from '@/components/container';

import useLayoutQuery from '@/hooks/useLayoutQuery';
import navigationFragment from '@/lib/fragments/navigation-fragment';

export async function getStaticProps({ preview = false }) {
  const graphqlRequest = {
    query: `
          query ProjectsQuery {
            allProjects {
              id
              slug
              title
              mainImage {
                responsiveImage(imgixParams: {fm: jpg, w: 1000 }) {
                  ...responsiveImageFragment
                }
              }
              projectType {
                id
                typeTitle
              }
              intro(markdown: true)
              motif {
                svg {
                  url
                }
              }
            }
            allProjectTypes {
              typeTitle
              id
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
    data: { allProjects: projects, allProjectTypes: projectTypes },
  } = useQuerySubscription(subscription);
  const navigation = useLayoutQuery(subscription);

  return (
    <Layout navigation={navigation} title="Projects">
      <main className="bg-white">
        <h1 className="sr-only">Projects</h1>
        <Container>
          <ProjectsGrid projects={projects} projectTypes={projectTypes} />
        </Container>
      </main>
    </Layout>
  );
}

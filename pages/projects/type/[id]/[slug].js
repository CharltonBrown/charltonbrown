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

export async function getStaticPaths() {
  const data = await request({ query: '{ allProjectTypes { slug, id } }' });

  return {
    paths: data.allProjectTypes.map(
      (type) => `/projects/type/${type.id}/${type.slug}`,
    ),
    fallback: false,
  };
}

export async function getStaticProps({ params, preview = false }) {
  const graphqlRequest = {
    query: `
          query ProjectsQuery($id: ItemId, $slug: String) {
            ${globalSeoFragment}
            allProjects(filter: {projectType: {eq: $id}}) {
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
            projectType(filter: {slug: {eq: $slug}}) {
              typeTitle
            }
            ${navigationFragment}
          }
          ${responsiveImageFragment}
        `,
    preview,
    variables: {
      slug: params.slug,
      id: params.id,
    },
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
    data: {
      _site: { globalSeo },
      allProjects: projects,
      projectType,
    },
  } = useQuerySubscription(subscription);
  const navigation = useLayoutQuery(subscription);

  const seo = {
    title: `${projectType.typeTitle} projects`,
    description: `A selection of ${projectType.typeTitle.toLowerCase()} projects by Charlton Brown.`,
  };

  return (
    <Layout
      navigation={navigation}
      globalSeo={globalSeo}
      seo={seo}
      hiddenPageHeading
    >
      <main className="bg-white">
        <Container>
          <ContentGutter>
            {projects.length > 0 ? (
              <OddEvenGrid
                items={projects}
                parentSlug="projects"
                type="projects"
              />
            ) : (
              <div className="h-screen">
                <p>No assigned {projectType.typeTitle} projects</p>
              </div>
            )}
          </ContentGutter>
        </Container>
      </main>
    </Layout>
  );
}

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
            allProjects(filter: {projectType: {eq: $id}}, first: 100) {
              id
              slug
              title
              mainImage {
                responsiveImage(imgixParams: {auto: format, w: 1000 }) {
                  ...responsiveImageFragment
                }
              }
              projectType {
                id
                typeTitle
              }
              intro {
                value
              }
              motif {
                motifId
              }
            }
            projectType(filter: {slug: {eq: $slug}}) {
              typeTitle
              seo: _seoMetaTags {
                ...metaTagsFragment
              }
            }
            ${navigationFragment}
          }
          ${metaTagsFragment}
          ${responsiveImageFragment}
        `,
    preview,
    includeDrafts: preview,
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
    data: { site, allProjects: projects, projectType },
  } = useQuerySubscription(subscription);
  const { navigation, preview } = useLayoutQuery(subscription);

  return (
    <Layout
      navigation={navigation}
      preview={preview}
      site={site}
      seo={projectType.seo}
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

import React from 'react';
import { useQuerySubscription } from 'react-datocms';
import { useScroll, useMotionValueEvent } from 'framer-motion';

import request from '@/lib/datocms';
import Layout from '@/components/layout';
import ProjectsGrid from '@/components/projectsGrid';
import { responsiveImageFragment } from '@/lib/fragments';
import mainNavigationFragment from '@/components/navigation/fragment';
import footerNavigationFragment from '@/components/footerNavigation/fragment';

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
            }
            allProjectTypes {
              typeTitle
              id
            }
            ${mainNavigationFragment}
            ${footerNavigationFragment}
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
    data: {
      allProjects: projects,
      allProjectTypes: projectTypes,
      mainNavigation,
      footerNavigation,
    },
  } = useQuerySubscription(subscription);

  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, 'change', (latest) => {
    console.log('Page scroll: ', latest);
  });

  return (
    <Layout
      mainNavigation={mainNavigation.links}
      footerNavigation={footerNavigation.links}
    >
      <main className="bg-white">
        <h1 className="sr-only">Projects</h1>
        <div className="p-8">
          <ProjectsGrid projects={projects} projectTypes={projectTypes} />
        </div>
      </main>
    </Layout>
  );
}

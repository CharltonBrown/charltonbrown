import React, { useEffect } from 'react';
import { useQuerySubscription } from 'react-datocms';
import clsx from 'clsx';
import { useContextSelector } from 'use-context-selector';

import request from '@/lib/datocms';
import Layout from '@/components/layout';
import ScrollSnap from '@/components/scroll-snap';
import RelatedBlock from '@/components/related-block';
import ProjectInfo from '@/components/project-info';
import PlaceholderImage from '@/components/placeholder-image';
import ExitPageCloseIcon from '@/components/exit-page-close-icon';
import { responsiveImageFragment } from '@/lib/fragments';
import mainNavigationFragment from '@/components/navigation/fragment';
import legalNavigationFragment from '@/components/legal-navigation/fragment';
import imageOrientation from '@/lib/utils/imageOrientation';

import navContext from '@/lib/context/navContext';

export async function getStaticPaths() {
  const data = await request({ query: '{ allProjects { slug } }' });

  return {
    paths: data.allProjects.map((post) => `/projects/${post.slug}`),
    fallback: false,
  };
}

export async function getStaticProps({ params, preview = false }) {
  const graphqlRequest = {
    query: `
          query ProjectBySlug($slug: String) {
            project(filter: {slug: {eq: $slug}}) {
              id
              description
              slug
              title
              mainImage {
                responsiveImage(imgixParams: {fm: jpg, w: 2000 }) {
                  ...responsiveImageFragment
                }
              }
              images {
                id
                responsiveImage(imgixParams: {fm: jpg, w: 2000 }) {
                  ...responsiveImageFragment
                }
              }
              relatedProject {
                title
                slug
                mainImage {
                  responsiveImage(imgixParams: {fm: jpg, w: 2000 }) {
                    ...responsiveImageFragment
                  }
                }
              }
            }
            ${mainNavigationFragment}
            ${legalNavigationFragment}
          }
          ${responsiveImageFragment}
        `,
    preview,
    variables: {
      slug: params.slug,
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

export default function Project({ subscription }) {
  const {
    data: { project, mainNavigation, legalNavigation },
  } = useQuerySubscription(subscription);
  const setNavContext = useContextSelector(navContext, (v) => v[1]);

  useEffect(() => {
    setNavContext((s) => ({
      ...s,
      navVisibility: 'hidden',
    }));
  }, [setNavContext]);

  const imageOrientationClass = (aspectRatio) => {
    if (imageOrientation(aspectRatio) === 'portrait') {
      return 'object-cover md:object-none md:w-[calc(100vh*0.7)] md:h-full';
    }
    if (imageOrientation(aspectRatio) === 'sqaure') {
      return 'object-cover md:object-none md:w-[calc(100vh/2)] md:h-full';
    }
    return 'object-cover md:w-full md:h-full';
  };

  return (
    <Layout
      mainNavigation={mainNavigation.links}
      legalNavigation={legalNavigation.links}
      hideHeader
      hideFooter
      title={project.title}
    >
      <main className="relative">
        <ProjectInfo title={project.title} description={project.description} />
        <ExitPageCloseIcon
          href="/projects"
          className="fixed right-4 top-4 z-40"
        />
        <ScrollSnap>
          <ScrollSnap.Child className="relative w-screen h-screen bg-white flex justify-center">
            <PlaceholderImage
              className={clsx(
                imageOrientationClass(
                  project.mainImage.responsiveImage.aspectRatio,
                ),
              )}
              src={project.mainImage.responsiveImage.src}
              alt={project.mainImage.responsiveImage.alt}
              fill
            />
          </ScrollSnap.Child>
          {project.images.map((image) => (
            <ScrollSnap.Child
              className="relative w-screen h-screen bg-white flex justify-center"
              key={image.id}
            >
              <PlaceholderImage
                className={clsx(
                  imageOrientationClass(image.responsiveImage.aspectRatio),
                )}
                src={image.responsiveImage.src}
                alt={image.responsiveImage.alt}
                fill
              />
            </ScrollSnap.Child>
          ))}
          {project.relatedProject && (
            <ScrollSnap.Child className="w-full h-screen">
              <RelatedBlock
                title={project.relatedProject.title}
                slug={project.relatedProject.slug}
                image={project.relatedProject.mainImage}
                label="Related project"
                alwaysHideNav
              />
            </ScrollSnap.Child>
          )}
        </ScrollSnap>
      </main>
    </Layout>
  );
}

import React, { useRef } from 'react';
import { useQuerySubscription } from 'react-datocms';
import clsx from 'clsx';
import { useRouter } from 'next/router';
import { useInView } from 'framer-motion';

import request from '@/lib/datocms';
import Layout from '@/components/layout';
import ScrollSnap from '@/components/scroll-snap';
import RelatedBlock from '@/components/related-block';
import ProjectInfo from '@/components/project-info';
import PlaceholderImage from '@/components/placeholder-image';
import imageOrientation from '@/lib/utils/imageOrientation';
import { responsiveImageFragment } from '@/lib/fragments';
import CloseIcon from '@/components/close-icon';

import useLayoutQuery from '@/hooks/useLayoutQuery';
import navigationFragment from '@/lib/fragments/navigation-fragment';
import globalSeoFragment from '@/lib/fragments/global-seo';

export async function getStaticPaths() {
  const data = await request({ query: '{ allProjects(first: 100) { slug } }' });

  return {
    paths: data.allProjects.map((post) => `/projects/${post.slug}`),
    fallback: false,
  };
}

export async function getStaticProps({ params, preview = false }) {
  const graphqlRequest = {
    query: `
          query ProjectBySlug($slug: String) {
            ${globalSeoFragment}
            project(filter: {slug: {eq: $slug}}) {
              seo {
                description
                title
              }
              id
              intro {
                value
              }
              body {
                value
              }
              slug
              title
              mainImage {
                responsiveImage(imgixParams: { auto: format, w: 3000 }) {
                  ...responsiveImageFragment
                }
              }
              images {
                id
                responsiveImage(imgixParams: { auto: format, w: 3000 }) {
                  ...responsiveImageFragment
                }
              }
              relatedProject {
                title
                slug
                mainImage {
                  responsiveImage(imgixParams: { auto: format, w: 3000 }) {
                    ...responsiveImageFragment
                  }
                }
              }
            }
            ${navigationFragment}
          }
          ${responsiveImageFragment}
        `,
    preview,
    includeDrafts: preview,
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
            token: process.env.NEXT_DATOCMS_API_TOKEN,
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
    data: { _site: site, project },
  } = useQuerySubscription(subscription);
  const { navigation, preview } = useLayoutQuery(subscription);
  const router = useRouter();
  const relatedRef = useRef();
  const relatedIsVisible = useInView(relatedRef, { amount: 'all' });

  const imageOrientationClass = (aspectRatio) => {
    if (imageOrientation(aspectRatio) === 'portrait') {
      return 'object-cover w-full h-full md:w-auto';
    }
    if (imageOrientation(aspectRatio) === 'sqaure') {
      return 'object-cover w-full h-full md:w-auto';
    }
    return 'object-cover w-full md:h-full';
  };

  return (
    <Layout
      navigation={navigation}
      preview={preview}
      site={site}
      seo={project.seo}
      hideHeader
      hideFooter
    >
      <main className="relative">
        <ProjectInfo
          hide={relatedIsVisible}
          title={project.title}
          intro={project.intro}
          body={project.body}
        />
        <CloseIcon
          onClick={() => router.push('/projects')}
          className="absolute right-4 top-4 z-40"
        />
        <ScrollSnap>
          <ScrollSnap.Child className="relative w-screen h-screen bg-white flex justify-center">
            <PlaceholderImage
              className={clsx(
                imageOrientationClass(
                  project.mainImage.responsiveImage.aspectRatio,
                ),
              )}
              image={project.mainImage.responsiveImage}
              overlappingTarget
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
                image={image.responsiveImage}
                overlappingTarget
              />
            </ScrollSnap.Child>
          ))}
          {project.relatedProject && (
            <ScrollSnap.Child className="w-full h-screen">
              <div ref={relatedRef} />
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

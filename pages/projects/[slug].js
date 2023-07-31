import React, { useRef } from 'react';
import { useQuerySubscription } from 'react-datocms';
import Image from 'next/image';
import clsx from 'clsx';
import { useScroll, useMotionValueEvent } from 'framer-motion';

import request from '@/lib/datocms';
import Layout from '@/components/layout';
import ScrollSnap from '@/components/scroll-snap';
import FadeInBlock from '@/components/fadeInBlock';
import { responsiveImageFragment } from '@/lib/fragments';
import mainNavigationFragment from '@/components/navigation/fragment';
import footerNavigationFragment from '@/components/footerNavigation/fragment';
import imageOrientation from '@/lib/utils/imageOrientation';

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
            }
            ${mainNavigationFragment}
            ${footerNavigationFragment}
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
    data: { project, mainNavigation, footerNavigation },
  } = useQuerySubscription(subscription);
  const footerRef = useRef(null);
  const scrollRef = useRef(null);

  const { scrollY } = useScroll({ container: scrollRef });

  useMotionValueEvent(scrollY, 'change', (latest) => {
    console.log('Page scroll: ', latest);
  });

  const imageOrientationClass = (aspectRatio) => {
    if (imageOrientation(aspectRatio) === 'portrait')
      return 'object-cover md:object-contain';
    if (imageOrientation(aspectRatio) === 'sqaure')
      return 'object-cover md:object-contain';
    return 'object-cover';
  };

  return (
    <Layout
      mainNavigation={mainNavigation.links}
      footerNavigation={footerNavigation.links}
    >
      <main>
        <ScrollSnap ref={scrollRef}>
          <ScrollSnap.Child className="relative w-screen h-screen bg-white">
            <Image
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
              className="relative w-screen h-screen bg-white"
              key={image.id}
            >
              <Image
                className={clsx(
                  imageOrientationClass(image.responsiveImage.aspectRatio),
                )}
                src={image.responsiveImage.src}
                alt={image.responsiveImage.alt}
                fill
              />
            </ScrollSnap.Child>
          ))}
          {/* Empty ScrollSnap.Child for footer snapping */}
          <ScrollSnap.Child className="w-full h-screen" ref={footerRef} />
        </ScrollSnap>
      </main>
    </Layout>
  );
}

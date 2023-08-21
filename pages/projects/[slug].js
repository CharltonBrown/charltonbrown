import React from 'react';
import { useQuerySubscription } from 'react-datocms';
import Image from 'next/image';
import clsx from 'clsx';

import request from '@/lib/datocms';
import Layout from '@/components/layout';
import ScrollSnap from '@/components/scroll-snap';
import RelatedBlock from '@/components/related-block';
import ProjectInfo from '@/components/project-info';
import { responsiveImageFragment } from '@/lib/fragments';
import mainNavigationFragment from '@/components/navigation/fragment';
import legalNavigationFragment from '@/components/legal-navigation/fragment';
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
      legalNavigation={legalNavigation.links}
      hideHeader
      hideFooter
      title={project.title}
    >
      <main className="relative">
        <ProjectInfo title={project.title} description={project.description} />
        <ScrollSnap>
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
          {project.relatedProject && (
            <ScrollSnap.Child className="w-full h-screen">
              <RelatedBlock
                title={project.relatedProject.title}
                slug={project.relatedProject.slug}
                image={project.relatedProject.mainImage}
                label="Related project"
              />
            </ScrollSnap.Child>
          )}
        </ScrollSnap>
      </main>
    </Layout>
  );
}

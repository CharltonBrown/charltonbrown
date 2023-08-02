import React from 'react';
import { useQuerySubscription } from 'react-datocms';
import Image from 'next/image';

import request from '@/lib/datocms';
import Layout from '@/components/layout';
import AboutUsNav from '@/components/about-us-navigation';
import RichText from '@/components/rich-text';
import { responsiveImageFragment } from '@/lib/fragments';
import mainNavigationFragment from '@/components/navigation/fragment';
import aboutUsNavigationFragment from '@/lib/fragments/about-us-navigation';
import FadeInBlock from '@/components/fade-in-block';
import SubNavigation from '@/components/sub-navigation';
import Container from '@/components/container';

export async function getStaticPaths() {
  const data = await request({ query: '{ allPosts { slug } }' });

  return {
    paths: data.allPosts.map((post) => `/about-us/journal/${post.slug}`),
    fallback: false,
  };
}

export async function getStaticProps({ params, preview = false }) {
  const graphqlRequest = {
    query: `
          query PostBySlug($slug: String) {
            post(filter: {slug: {eq: $slug}}) {
              id
              body {
                value
              }
              slug
              title
              mainImage {
                responsiveImage(imgixParams: {fm: jpg, w: 1000 }) {
                  ...responsiveImageFragment
                }
              }
              id
            }
            ${aboutUsNavigationFragment}
            ${mainNavigationFragment}
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

export default function Posts({ subscription }) {
  const {
    data: { post, mainNavigation, aboutUsNavigation },
  } = useQuerySubscription(subscription);

  return (
    <Layout mainNavigation={mainNavigation.links} hideFooter>
      <main className="bg-white">
        <h1 className="sr-only">Journal</h1>
        <Container>
          <div className="flex">
            <SubNavigation>
              <AboutUsNav links={aboutUsNavigation.links} />
            </SubNavigation>
            <div className="pt-[200px] pl-8 grow">
              <FadeInBlock>
                <div className="lg:flex flex-row-reverse items-stretch">
                  <div className="relative">
                    <div className="lg:sticky top-1/2 -translate-y-1/2 lg:px-24">
                      <Image
                        className="object-contain mb-8"
                        width={post.mainImage.responsiveImage.width}
                        height={post.mainImage.responsiveImage.height}
                        src={post.mainImage.responsiveImage.src}
                        alt={post.mainImage.responsiveImage.alt}
                      />
                    </div>
                  </div>
                  <div>
                    <h1 className="text-3xl mb-8">{post.title}</h1>
                    <RichText text={post.body} />
                  </div>
                </div>
              </FadeInBlock>
            </div>
          </div>
        </Container>
      </main>
    </Layout>
  );
}

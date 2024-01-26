import React, { useEffect } from 'react';
import { useQuerySubscription } from 'react-datocms';
import { useContextSelector } from 'use-context-selector';
import { useRouter } from 'next/router';

import request from '@/lib/datocms';
import Layout from '@/components/layout';
import RichText from '@/components/rich-text';

import FadeInBlock from '@/components/fade-in-block';
import Container from '@/components/container';
import PlaceholderImage from '@/components/placeholder-image';
import useLayoutQuery from '@/hooks/useLayoutQuery';
import navContext from '@/lib/context/navContext';
import CloseIcon from '@/components/close-icon';
import ContentGutter from '@/components/content-gutter';
import {
  responsiveImageFragment,
  metaTagsFragment,
  navigationFragment,
  globalSeoFragment,
} from '@/lib/fragments';

export async function getStaticPaths() {
  const data = await request({ query: '{ allPosts(first: 100) { slug } }' });

  return {
    paths: data.allPosts.map((post) => `/about-us/journal/${post.slug}`),
    fallback: false,
  };
}

export async function getStaticProps({ params, preview = false }) {
  const graphqlRequest = {
    query: `
          query PostBySlug($slug: String) {
            ${globalSeoFragment}
            post(filter: {slug: {eq: $slug}}) {
              seo: _seoMetaTags {
                ...metaTagsFragment
              }
              id
              body {
                value
              }
              slug
              title
              mainImage {
                responsiveImage(imgixParams: {auto: format, w: 1500 }) {
                  ...responsiveImageFragment
                }
              }
              id
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

export default function Posts({ subscription }) {
  const {
    data: {
      site,
      post: { seo, title, mainImage, body },
    },
  } = useQuerySubscription(subscription);
  const { navigation, preview } = useLayoutQuery(subscription);
  const setNavContext = useContextSelector(navContext, (v) => v[1]);
  const router = useRouter();

  useEffect(() => {
    setNavContext((s) => ({
      ...s,
      navVisibility: 'hidden',
    }));
  }, [setNavContext]);

  return (
    <Layout
      navigation={navigation}
      preview={preview}
      hideHeader
      hideFooter
      seo={seo}
      site={site}
    >
      <main className="bg-white">
        <CloseIcon
          onClick={() => router.push('/about-us/journal')}
          className="fixed right-4 top-4 z-20"
        />
        <Container>
          <ContentGutter className="lg:pl-8">
            <FadeInBlock>
              <div className="lg:flex flex-row-reverse">
                <div className="lg:sticky bottom-0 lg:w-3/5 lg:px-24">
                  <PlaceholderImage
                    className="object-contain mb-8 lg:mb-0"
                    image={mainImage.responsiveImage}
                    overlappingTarget
                  />
                </div>
                <div className="lg:w-2/5">
                  <h1 className="text-3xl mb-8">{title}</h1>
                  <RichText text={body} />
                </div>
              </div>
            </FadeInBlock>
          </ContentGutter>
        </Container>
      </main>
    </Layout>
  );
}

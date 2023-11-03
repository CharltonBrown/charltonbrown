import React, { useEffect } from 'react';
import { useQuerySubscription } from 'react-datocms';
import { useContextSelector } from 'use-context-selector';
import { useRouter } from 'next/router';

import request from '@/lib/datocms';
import Layout from '@/components/layout';
import RichText from '@/components/rich-text';
import { responsiveImageFragment } from '@/lib/fragments';
import globalSeoFragment from '@/lib/fragments/global-seo';

import FadeInBlock from '@/components/fade-in-block';
import Container from '@/components/container';
import PlaceholderImage from '@/components/placeholder-image';
import useLayoutQuery from '@/hooks/useLayoutQuery';
import navigationFragment from '@/lib/fragments/navigation-fragment';
import navContext from '@/lib/context/navContext';
import CloseIcon from '@/components/close-icon';
import ContentGutter from '@/components/content-gutter';

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
            ${globalSeoFragment}
            post(filter: {slug: {eq: $slug}}) {
              seo {
                description
                title
              }
              id
              body {
                value
              }
              slug
              title
              mainImage {
                responsiveImage(imgixParams: {fm: jpg, w: 1500 }) {
                  ...responsiveImageFragment
                }
              }
              id
            }
            ${navigationFragment}
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
    data: {
      _site: { globalSeo },
      post: { seo, title, mainImage, body },
    },
  } = useQuerySubscription(subscription);
  const navigation = useLayoutQuery(subscription);
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
      hideHeader
      hideFooter
      seo={seo}
      globalSeo={globalSeo}
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
                    width={mainImage.responsiveImage.width}
                    height={mainImage.responsiveImage.height}
                    src={mainImage.responsiveImage.src}
                    alt={mainImage.responsiveImage.alt}
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

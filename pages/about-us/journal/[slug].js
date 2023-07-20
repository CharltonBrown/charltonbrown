import React from 'react';
import { useQuerySubscription } from 'react-datocms';

import request from '@/lib/datocms';
import Layout from '@/components/layout';
import AboutUsNav from '@/components/aboutUsNav';
import { responsiveImageFragment } from '@/lib/fragments';
import mainNavigationFragment from '@/components/navigation/fragment';
import footerNavigationFragment from '@/components/footerNavigation/fragment';
import aboutUsNavigationFragment from '@/lib/fragments/about-us-navigation';

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
              body
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

export default function Posts({ subscription }) {
  const {
    data: { post, mainNavigation, footerNavigation, aboutUsNavigation },
  } = useQuerySubscription(subscription);

  console.log({ post });

  return (
    <Layout
      mainNavigation={mainNavigation.links}
      footerNavigation={footerNavigation.links}
    >
      <h1 className="sr-only">Journal</h1>
      <div className="p-8">
        <div className="flex">
          <aside className="w-[220px] h-screen sticky top-0 flex flex-col justify-center">
            <AboutUsNav links={aboutUsNavigation.links} />
          </aside>
          <div className="pt-[200px] pl-8 grow">something</div>
        </div>
      </div>
    </Layout>
  );
}

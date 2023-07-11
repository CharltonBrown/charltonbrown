import React from 'react';
import { useQuerySubscription } from 'react-datocms';
import Link from 'next/link';

import request from '@/lib/datocms';
import Layout from '@/components/layout';
import mainNavigationFragment from '@/components/navigation/fragment';
import footerNavigationFragment from '@/components/footerNavigation/fragment';

export async function getStaticProps({ preview = false }) {
  const graphqlRequest = {
    query: `
          query peoplePageContent {
            allPosts {
              body
              heading
              id
              slug
            }
            ${mainNavigationFragment}
            ${footerNavigationFragment}
          }
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

export default function Posts({ subscription }) {
  const {
    data: { allPosts: posts, mainNavigation, footerNavigation },
  } = useQuerySubscription(subscription);

  console.log({ posts });

  return (
    <Layout
      mainNavigation={mainNavigation.links}
      footerNavigation={footerNavigation.links}
    >
      <div className="relative bg-black p-8 text-white mt-[300px] z-50">
        <ul>
          {posts.map((post) => (
            <li key={post.id}>
              <Link href={`/about-us/journal/${post.slug}`}>
                {post.heading}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </Layout>
  );
}

import React from 'react';
import { useQuerySubscription } from 'react-datocms';
import Link from 'next/link';

import request from '@/lib/datocms';
import Layout from '@/components/layout';

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
    data: { allPosts: posts },
  } = useQuerySubscription(subscription);

  console.log({ posts });

  return (
    <Layout>
      <div className="p-8">posts</div>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            <Link href={`/about-us/journal/${post.slug}`}>{post.heading}</Link>
          </li>
        ))}
      </ul>
    </Layout>
  );
}

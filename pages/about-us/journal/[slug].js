import React from 'react';
import { useQuerySubscription } from 'react-datocms';

import request from '@/lib/datocms';
import Layout from '@/components/layout';

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
              body
              heading
              id
            }
          }          
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
    data: { post },
  } = useQuerySubscription(subscription);

  console.log({ post });

  return (
    <Layout>
      <div className="p-8">post</div>
    </Layout>
  );
}

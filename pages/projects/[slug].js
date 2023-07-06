import React from 'react';
import { useQuerySubscription } from 'react-datocms';

import request from '@/lib/datocms';
import Layout from '@/components/layout';

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

export default function Project({ subscription }) {
  const {
    data: { project },
  } = useQuerySubscription(subscription);

  console.log({ project });

  return (
    <Layout>
      <div className="p-8">post</div>
    </Layout>
  );
}

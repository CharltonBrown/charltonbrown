import React from 'react';
import { useQuerySubscription } from 'react-datocms';
import Link from 'next/link';

import request from '@/lib/datocms';
import Layout from '@/components/layout';

export async function getStaticProps({ preview = false }) {
  const graphqlRequest = {
    query: `
          query ServicesQuery {
            allServices {
              id
              description
              slug
              title
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

export default function Home({ subscription }) {
  const {
    data: { allProjects: projects },
  } = useQuerySubscription(subscription);

  console.log({ projects });

  return (
    <Layout>
      <div className="p-8">projects</div>
      <ul>
        {projects.map((project) => (
          <li key={project.id}>
            <Link href={`/projects/${project.slug}`}>{project.title}</Link>
          </li>
        ))}
      </ul>
    </Layout>
  );
}

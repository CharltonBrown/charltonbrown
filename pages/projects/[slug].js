import React from 'react'
import { useQuerySubscription, renderMetaTags } from 'react-datocms';

import request from '../../../lib/datocms';


export async function getStaticProps({ preview = false }) {
  const graphqlRequest = {
    query: `
          query ProjectsQuery {
            allProjects	{
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
    data: { allProjects },
  } = useQuerySubscription(subscription);

  console.log({ allProjects })

  return (
    <div>projects</div>
  );
}

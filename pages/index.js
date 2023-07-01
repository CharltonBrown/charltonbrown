import React from 'react'
import { useQuerySubscription, renderMetaTags } from 'react-datocms';

import request from '../lib/datocms';


export async function getStaticProps({ preview = false }) {
  const graphqlRequest = {
    query: `
          query HomePageContent {
            homepage {
              header
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
    data: { homepage },
  } = useQuerySubscription(subscription);

  console.log({ homepage })

  return (
    <div>homepage</div>
  );

  // return (
  //   <Layout darkNav navigation={navigation} allBanners={allBanners}>
  //     <Head>{renderMetaTags(homepage.seo)}</Head>
  //     <ModularContent content={homepage.content} />
  //     <PreFooter />
  //   </Layout>
  // );
}

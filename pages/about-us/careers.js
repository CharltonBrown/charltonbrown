import React from 'react';
import { useQuerySubscription } from 'react-datocms';

import request from '@/lib/datocms';
import Layout from '@/components/layout';
import TextImageBlock from '@/components/text-image-block';
import { responsiveImageFragment } from '@/lib/fragments';
import textImageBlockFragment from '@/components/text-image-block/fragment';
import Container from '@/components/container';
import RelatedBlock from '@/components/related-block';
import relatedFragment from '@/components/related-block/fragment';

import useLayoutQuery from '@/hooks/useLayoutQuery';
import navigationFragment from '@/lib/fragments/navigation-fragment';

export async function getStaticProps({ preview = false }) {
  const graphqlRequest = {
    query: `
          query careersPageContent {
            careersPage {
              ${textImageBlockFragment}
              ${relatedFragment}
            }
            ${navigationFragment}
          }
          ${responsiveImageFragment}
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

export default function Careers({ subscription }) {
  const {
    data: { careersPage },
  } = useQuerySubscription(subscription);
  const navigation = useLayoutQuery(subscription);
  const related = careersPage.related[0];

  return (
    <Layout navigation={navigation} title="Careers">
      <main className="bg-white">
        <h1 className="sr-only">Careers</h1>
        <Container>
          <div className="pt-[200px] lg:pl-60">
            {careersPage?.textImageBlock.map((block) => (
              <TextImageBlock
                key={block.id}
                body={block.body}
                heading={block.heading}
                image={block.image}
                imageAlignment={block.imageAlignment}
              />
            ))}
          </div>
        </Container>
        {careersPage.related && (
          <div className="w-full h-screen">
            <RelatedBlock
              title={related.title}
              slug={related.url}
              image={related.image}
              label="Related content"
            />
          </div>
        )}
      </main>
    </Layout>
  );
}

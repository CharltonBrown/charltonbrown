import React from 'react';
import { useQuerySubscription } from 'react-datocms';

import request from '@/lib/datocms';
import Layout from '@/components/layout';
import TextImageBlock from '@/components/text-image-block';
import { responsiveImageFragment } from '@/lib/fragments';
import textImageBlockFragment from '@/components/text-image-block/fragment';
import Container from '@/components/container';
import RelatedBlock from '@/components/related-block';
import ContentGutter from '@/components/content-gutter';
import relatedFragment from '@/components/related-block/fragment';

import useLayoutQuery from '@/hooks/useLayoutQuery';
import navigationFragment from '@/lib/fragments/navigation-fragment';

export async function getStaticProps({ preview = false }) {
  const graphqlRequest = {
    query: `
          query aboutPageContent {
            about {
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

export default function About({ subscription }) {
  const {
    data: { about },
  } = useQuerySubscription(subscription);
  const navigation = useLayoutQuery(subscription);
  const related = about.related[0];

  return (
    <Layout navigation={navigation} title="About us">
      <main className="bg-white">
        <h1 className="sr-only">About us</h1>
        <Container>
          <ContentGutter>
            {about?.textImageBlock.map((block) => (
              <TextImageBlock
                key={block.id}
                body={block.body}
                heading={block.heading}
                image={block.image}
                imageAlignment={block.imageAlignment}
              />
            ))}
          </ContentGutter>
        </Container>
        {about?.related && (
          <RelatedBlock
            title={related.title}
            slug={related.url}
            image={related.image}
            label="Related content"
          />
        )}
      </main>
    </Layout>
  );
}

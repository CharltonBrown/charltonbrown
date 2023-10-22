import React from 'react';
import { useQuerySubscription } from 'react-datocms';

import request from '@/lib/datocms';
import Layout from '@/components/layout';
import Container from '@/components/container';
import useLayoutQuery from '@/hooks/useLayoutQuery';
import RichText from '@/components/rich-text';
import ContentGutter from '@/components/content-gutter';
import navigationFragment from '@/lib/fragments/navigation-fragment';

export async function getStaticPaths() {
  const data = await request({
    query: `{
      allPages {
        slug
        title
      }
    }`,
  });

  const pages = data.allPages.map((page) => ({
    params: { slug: [page.slug] },
  }));

  return {
    paths: [...pages],
    fallback: false,
  };
}

export async function getStaticProps({ params, preview = false }) {
  const pageSlug = params.slug[params.slug.length - 1];

  const graphqlRequest = {
    query: `
          query PageBySlug($slug: String) {
            page(filter: {slug: {eq: $slug}}) {
              body {
                value
              }
              slug
              title
              id
            }
            ${navigationFragment}
          }
        `,
    preview,
    variables: {
      slug: pageSlug,
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

export default function Page({ subscription }) {
  const {
    data: { page },
  } = useQuerySubscription(subscription);
  const navigation = useLayoutQuery(subscription);

  return (
    <Layout navigation={navigation} title={page.title}>
      <main className="bg-white">
        <Container>
          <ContentGutter>
            <h1 className="text-3xl mb-8">{page.title}</h1>
            <RichText text={page.body} />
          </ContentGutter>
        </Container>
      </main>
    </Layout>
  );
}

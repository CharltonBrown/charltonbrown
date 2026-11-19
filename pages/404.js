import React from 'react';
import Link from 'next/link';
import { useQuerySubscription } from 'react-datocms';

import request from '@/lib/datocms';
import Layout from '@/components/layout';
import useLayoutQuery from '@/hooks/useLayoutQuery';
import { globalSeoFragment, navigationFragment } from '@/lib/fragments';

export async function getStaticProps({ preview = false }) {
  const graphqlRequest = {
    query: `query NotFoundPage { ${globalSeoFragment} ${navigationFragment} }`,
    preview,
    includeDrafts: preview,
  };

  return {
    props: {
      subscription: preview
        ? {
            ...graphqlRequest,
            initialData: await request(graphqlRequest),
            token: process.env.NEXT_DATOCMS_API_TOKEN,
          }
        : {
            enabled: false,
            initialData: await request(graphqlRequest),
          },
    },
  };
}

const seo = [{ tag: 'title', content: 'Page not found — Charlton Brown' }];

export default function NotFound({ subscription }) {
  const {
    data: { site },
  } = useQuerySubscription(subscription);
  const { navigation, preview } = useLayoutQuery(subscription);

  return (
    <Layout navigation={navigation} preview={preview} site={site} seo={seo}>
      <main className="bg-white min-h-[60vh] flex items-center px-10 py-20">
        <div>
          <p className="font-savoyBold text-xs uppercase tracking-widest text-gray mb-4">
            404
          </p>
          <h1 className="font-savoyBold text-4xl mb-6">Page not found</h1>
          <p className="font-savoyRegular text-gray mb-8">
            The page you&rsquo;re looking for doesn&rsquo;t exist or has been
            moved.
          </p>
          <Link
            href="/"
            className="font-savoyBold text-xs uppercase tracking-widest underline"
          >
            Return to homepage
          </Link>
        </div>
      </main>
    </Layout>
  );
}

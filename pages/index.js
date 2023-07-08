import React from 'react';
import { useQuerySubscription } from 'react-datocms';

import request from '@/lib/datocms';
import { responsiveImageFragment } from '@/lib/fragments';
import Layout from '@/components/layout';
import HeroSlider from '@/components/hero-slider';

export async function getStaticProps({ preview = false }) {
  const graphqlRequest = {
    query: `
          query HomePageContent {
            homepage {
              sliderImages {
                id
                responsiveImage(imgixParams: {fm: jpg, w: 4000 }) {
                  ...responsiveImageFragment
                }
              }
              introLabel
              quote
              blockOneLabel
              blockOneBody(markdown: true)
              blockTwoLabel
              blockTwoBody(markdown: true)
              blockThreeLabel
              blockThreeBody(markdown: true)
            }
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

export default function Home({ subscription }) {
  const {
    data: {
      homepage: {
        blockOneLabel,
        blockOneBody,
        blockTwoLabel,
        blockTwoBody,
        blockThreeLabel,
        blockThreeBody,
        introLabel,
        quote,
        sliderImages,
      },
    },
  } = useQuerySubscription(subscription);

  return (
    <Layout>
      <HeroSlider images={sliderImages} />
      <div className="relative mt-[calc(100vh)] z-50">
        <div className="flex flex-col items-center w-full p-7 bg-bone mt-[400px] text-center">
          <div className="max-w-xl pt-8 pb-32">
            <h2 className="text-4xl">{introLabel}</h2>
            <div
              className="text-4xl"
              dangerouslySetInnerHTML={{
                __html: quote,
              }}
            />
          </div>
          <div className="max-w-xl pt-8 pb-32">
            <h2 className="uppercase text-xl mb-4">{blockOneLabel}</h2>
            <div
              className="text-xl"
              dangerouslySetInnerHTML={{
                __html: blockOneBody,
              }}
            />
          </div>
          <div className="max-w-xl pt-8 pb-32">
            <h2 className="uppercase text-xl mb-4">{blockTwoLabel}</h2>
            <div
              className="text-xl"
              dangerouslySetInnerHTML={{
                __html: blockTwoBody,
              }}
            />
          </div>
          <div className="max-w-xl pt-8 pb-32">
            <h2 className="uppercase text-xl mb-4">{blockThreeLabel}</h2>
            <div
              className="text-xl"
              dangerouslySetInnerHTML={{
                __html: blockThreeBody,
              }}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
}

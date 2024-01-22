import React, { useRef } from 'react';
import { useQuerySubscription } from 'react-datocms';
import { useInView } from 'framer-motion';
import * as widont from 'widont';

import request from '@/lib/datocms';
import { responsiveImageFragment } from '@/lib/fragments';
import Layout from '@/components/layout';
import HeroSlider from '@/components/hero-slider';
import MotifNavigation from '@/components/motif-navigation';
import ScrollPrompt from '@/components/scroll-prompt';

import useLayoutQuery from '@/hooks/useLayoutQuery';
import navigationFragment from '@/lib/fragments/navigation-fragment';
import globalSeoFragment from '@/lib/fragments/global-seo';
import HomepageBlock from '@/components/homepage-block';

export async function getStaticProps({ preview = false }) {
  const graphqlRequest = {
    query: `
          query HomePageContent {
            ${globalSeoFragment}
            homepage {
              seo {
                description
                title
              }
              sliderImages {
                id
                responsiveImage(imgixParams: { w: 4000, auto: format  }) {
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
            ${navigationFragment}
          }
          ${responsiveImageFragment}
        `,
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

export default function Home({ subscription }) {
  const {
    data: {
      _site: site,
      homepage: {
        seo,
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
  const { navigation, preview } = useLayoutQuery(subscription);
  const heroRef = useRef(null);
  const heroIsInView = useInView(heroRef, {
    margin: '-1px 0px 0px 0px',
  });

  return (
    <Layout
      navigation={navigation}
      preview={preview}
      site={site}
      seo={seo}
      hiddenPageHeading
    >
      <main>
        <HeroSlider images={sliderImages} hideHero={!heroIsInView} />
        <div className="relative z-30">
          {/* div for fixed hero */}
          <div className="w-full h-screen relative" ref={heroRef}>
            <ScrollPrompt className="absolute bottom-0 left-1/2 -translate-x-1/2" />
          </div>
          <div className="bg-bone text-center">
            <HomepageBlock includeFootnote>
              <HomepageBlock.Inner>
                <h2 className="text-3xl lg:text-5xl">{introLabel}</h2>
                <div
                  className="text-3xl lg:text-5xl font-savoyItalic"
                  dangerouslySetInnerHTML={{
                    __html: quote,
                  }}
                />
              </HomepageBlock.Inner>
              <HomepageBlock.Inner>
                <h2 className="uppercase text-xl lg:text-2xl mb-4 font-savoyBold tracking-wider">
                  {blockOneLabel}
                </h2>
                <div
                  className="text-xl lg:text-2xl"
                  dangerouslySetInnerHTML={{
                    __html: widont(blockOneBody),
                  }}
                />
              </HomepageBlock.Inner>
            </HomepageBlock>
            <HomepageBlock includeFootnote>
              <HomepageBlock.Inner>
                <h2 className="uppercase text-xl lg:text-2xl mb-4 font-savoyBold tracking-wider">
                  {blockTwoLabel}
                </h2>
                <div
                  className="text-xl lg:text-2xl"
                  dangerouslySetInnerHTML={{
                    __html: widont(blockTwoBody),
                  }}
                />
              </HomepageBlock.Inner>
            </HomepageBlock>
            <HomepageBlock>
              <HomepageBlock.Inner>
                <h2 className="mx-auto uppercase text-xl lg:text-2xl mb-4 font-savoyBold tracking-wider">
                  {blockThreeLabel}
                </h2>
                <div
                  className="mx-auto text-xl lg:text-2xl"
                  dangerouslySetInnerHTML={{
                    __html: widont(blockThreeBody),
                  }}
                />
                <MotifNavigation links={navigation.mainNavigation} />
              </HomepageBlock.Inner>
            </HomepageBlock>
          </div>
        </div>
      </main>
    </Layout>
  );
}

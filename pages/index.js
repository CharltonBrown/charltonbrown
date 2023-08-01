import React, { useRef } from 'react';
import { useQuerySubscription } from 'react-datocms';
import { useInView } from 'framer-motion';

import request from '@/lib/datocms';
import { responsiveImageFragment } from '@/lib/fragments';
import Layout from '@/components/layout';
import HeroSlider from '@/components/hero-slider';
import FadeInBlock from '@/components/fadeInBlock';
import ScrollSnap from '@/components/scroll-snap';
import Footer from '@/components/footer';

import mainNavigationFragment from '@/components/navigation/fragment';
import footerNavigationFragment from '@/components/footerNavigation/fragment';
import MotifNavigation from '../components/motif-navigation';

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
            ${mainNavigationFragment}
            ${footerNavigationFragment}
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
      mainNavigation,
      footerNavigation,
    },
  } = useQuerySubscription(subscription);
  const heroRef = useRef(null);
  const heroIsInView = useInView(heroRef, {
    margin: '-1px 0px 0px 0px',
  });
  const footerRef = useRef(null);

  return (
    <Layout
      mainNavigation={mainNavigation.links}
      footerNavigation={footerNavigation.links}
      footerRef={footerRef}
    >
      <main>
        <HeroSlider images={sliderImages} hideHero={!heroIsInView} />
        <ScrollSnap>
          <ScrollSnap.Child className="w-full h-screen" ref={heroRef} />
          <ScrollSnap.Child>
            <div className="relative z-50 h-screen flex items-center justify-center snap-start bg-bone">
              <FadeInBlock>
                <div className="max-w-3xl py-8 px-5 md:px-7 lg:px-10">
                  <h2 className="text-3xl lg:text-5xl">{introLabel}</h2>
                  <div
                    className="text-3xl lg:text-5xl font-savoyItalic"
                    dangerouslySetInnerHTML={{
                      __html: quote,
                    }}
                  />
                </div>
                <div className="max-w-2xl py-8 px-5 md:px-7 lg:px-10">
                  <h2 className="uppercase text-xl lg:text-2xl mb-4 font-savoyBold tracking-wider">
                    {blockOneLabel}
                  </h2>
                  <div
                    className="text-xl lg:text-2xl"
                    dangerouslySetInnerHTML={{
                      __html: blockOneBody,
                    }}
                  />
                </div>
              </FadeInBlock>
            </div>
          </ScrollSnap.Child>
          <ScrollSnap.Child>
            <div className="h-screen flex items-center justify-center snap-start bg-bone">
              <FadeInBlock>
                <div className="max-w-2xl py-8 px-5 md:px-7 lg:px-10">
                  <h2 className="uppercase text-xl lg:text-2xl mb-4 font-savoyBold tracking-wider">
                    {blockTwoLabel}
                  </h2>
                  <div
                    className="text-xl lg:text-2xl"
                    dangerouslySetInnerHTML={{
                      __html: blockTwoBody,
                    }}
                  />
                </div>
              </FadeInBlock>
            </div>
          </ScrollSnap.Child>
          <ScrollSnap.Child>
            <div className="h-screen flex items-center justify-center snap-start bg-bone">
              <FadeInBlock>
                <div className="max-w-2xl py-8 px-5 md:px-7 lg:px-10">
                  <h2 className="mx-auto uppercase text-xl lg:text-2xl mb-4 font-savoyBold tracking-wider">
                    {blockThreeLabel}
                  </h2>
                  <div
                    className="mx-auto text-xl lg:text-2xl"
                    dangerouslySetInnerHTML={{
                      __html: blockThreeBody,
                    }}
                  />
                  <MotifNavigation links={mainNavigation.links} />
                </div>
              </FadeInBlock>
            </div>
          </ScrollSnap.Child>
          {/* Empty ScrollSnap.Child for footer snapping */}
          <ScrollSnap.Child>
            <Footer footerNavigation={footerNavigation.links} />
          </ScrollSnap.Child>
        </ScrollSnap>
      </main>
    </Layout>
  );
}

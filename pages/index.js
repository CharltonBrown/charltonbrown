import React, { useRef } from 'react';
import { useQuerySubscription } from 'react-datocms';
import { useInView } from 'framer-motion';

import request from '@/lib/datocms';
import { responsiveImageFragment } from '@/lib/fragments';
import Layout from '@/components/layout';
import HeroSlider from '@/components/hero-slider';
import FadeInBlock from '@/components/fade-in-block';
import mainNavigationFragment from '@/components/navigation/fragment';
import footerFragment from '@/components/footer/fragment';
import legalNavigationFragment from '@/components/legal-navigation/fragment';
import MotifNavigation from '@/components/motif-navigation';
import FootnoteOne from '@/components/icons/footnotes/footnote-1';
import Container from '@/components/container';

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
            ${footerFragment}
            ${legalNavigationFragment}
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
      footer,
      legalNavigation,
    },
  } = useQuerySubscription(subscription);
  const heroRef = useRef(null);
  const heroIsInView = useInView(heroRef, {
    margin: '-1px 0px 0px 0px',
  });

  return (
    <Layout
      mainNavigation={mainNavigation.links}
      legalNavigation={legalNavigation.links}
      footer={footer}
    >
      <main>
        <h1 className="sr-only">Charlton Brown - Architecture & Interiors</h1>
        <HeroSlider images={sliderImages} hideHero={!heroIsInView} />
        <div className="relative z-50">
          {/* Empty div for fixed hero */}
          <div className="w-full h-screen" ref={heroRef} />
          <div className="bg-bone">
            <div className="relative h-screen flex items-center justify-center py-8">
              <Container>
                <FadeInBlock>
                  <div className="max-w-3xl mx-auto py-8 px-5 md:px-7 lg:px-10">
                    <h2 className="text-3xl lg:text-5xl">{introLabel}</h2>
                    <div
                      className="text-3xl lg:text-5xl font-savoyItalic"
                      dangerouslySetInnerHTML={{
                        __html: quote,
                      }}
                    />
                  </div>
                  <div className="max-w-3xl mx-auto py-8 px-5 md:px-7 lg:px-10">
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
                <div className="absolute bottom-0 w-full inset-x-0">
                  <FadeInBlock>
                    <FootnoteOne className="absolute left-1/2 -translate-y-1/2 bottom-16 w-4" />
                  </FadeInBlock>
                </div>
              </Container>
            </div>
            <div className="relative h-screen flex items-center justify-center">
              <Container>
                <FadeInBlock>
                  <div className="max-w-3xl mx-auto py-8 px-5 md:px-7 lg:px-10">
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
                <div className="absolute bottom-0 w-full inset-x-0">
                  <FadeInBlock>
                    <FootnoteOne className="absolute left-1/2 -translate-y-1/2 bottom-16 w-4" />
                  </FadeInBlock>
                </div>
              </Container>
            </div>
            <div className="h-screen flex items-center justify-center">
              <Container>
                <FadeInBlock>
                  <div className="max-w-3xl mx-auto py-8 px-5 md:px-7 lg:px-10">
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
              </Container>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
}

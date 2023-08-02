import React from 'react';
import { useQuerySubscription } from 'react-datocms';

import request from '@/lib/datocms';
import Layout from '@/components/layout';
import AboutUsNav from '@/components/about-us-navigation';
import TextImageBlock from '@/components/text-image-block';
import { responsiveImageFragment } from '@/lib/fragments';
import mainNavigationFragment from '@/components/navigation/fragment';
import legalNavigationFragment from '@/components/legal-navigation/fragment';
import aboutUsNavigationFragment from '@/lib/fragments/about-us-navigation';
import footerFragment from '@/components/footer/fragment';
import SubNavigation from '@/components/sub-navigation';
import Container from '@/components/container';
import RelatedBlock from '@/components/related-block';

export async function getStaticProps({ preview = false }) {
  const graphqlRequest = {
    query: `
          query aboutPageContent {
            about {
              textImageBlock {
                id
                body
                heading
                id
                imageAlignment
                image {
                  responsiveImage(imgixParams: {fm: jpg, w: 1000 }) {
                    ...responsiveImageFragment
                  }
                }
              }
              related {
                title
                url
                image {
                  responsiveImage(imgixParams: {fm: jpg, w: 1000 }) {
                    ...responsiveImageFragment
                  }
                }
              }
            }
            ${aboutUsNavigationFragment}
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

export default function About({ subscription }) {
  const {
    data: { about, mainNavigation, footer, legalNavigation, aboutUsNavigation },
  } = useQuerySubscription(subscription);
  const related = about.related[0];

  return (
    <Layout
      mainNavigation={mainNavigation.links}
      legalNavigation={legalNavigation.links}
      footer={footer}
    >
      <main className="bg-white">
        <h1 className="sr-only">About us</h1>
        <Container>
          <div className="flex">
            <SubNavigation>
              <AboutUsNav links={aboutUsNavigation.links} />
            </SubNavigation>
            <div className="pt-[200px] pl-8 grow">
              {about?.textImageBlock.map((block) => (
                <TextImageBlock
                  key={block.id}
                  body={block.body}
                  heading={block.heading}
                  image={block.image}
                  imageAlignment={block.imageAlignment}
                />
              ))}
            </div>
          </div>
        </Container>
        {about.related && (
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

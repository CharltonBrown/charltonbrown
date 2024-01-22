import React, { useRef } from 'react';
import { useQuerySubscription } from 'react-datocms';
import { motion, useInView } from 'framer-motion';

import request from '@/lib/datocms';
import Layout from '@/components/layout';
import { responsiveImageFragment } from '@/lib/fragments';
import footerBlockFragment from '@/components/footer-block/fragment';
import FooterBlock from '@/components/footer-block';
import PlaceholderImage from '@/components/placeholder-image';

import useLayoutQuery from '@/hooks/useLayoutQuery';
import navigationFragment from '@/lib/fragments/navigation-fragment';
import globalSeoFragment from '@/lib/fragments/global-seo';

export async function getStaticProps({ preview = false }) {
  const graphqlRequest = {
    query: `
          query contactPageContent {
            ${globalSeoFragment}
            contact {
              seo {
                description
                title
              }
              image {
                responsiveImage(imgixParams: {auto: format, w: 2000 }) {
                  ...responsiveImageFragment
                }
              }
              blocks {
                ${footerBlockFragment}
              }
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

const variants = {
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.5,
      delayChildren: 0.5,
    },
  },
  hidden: { opacity: 0 },
};

export default function Contact({ subscription }) {
  const {
    data: { _site: site, contact },
  } = useQuerySubscription(subscription);
  const { navigation, preview } = useLayoutQuery(subscription);
  const ref = useRef(null);
  const contentIsInView = useInView(ref, {
    margin: '0px 0px 0px 0px',
  });

  return (
    <Layout
      navigation={navigation}
      preview={preview}
      site={site}
      seo={contact.seo}
      hideFooter
    >
      <main className="bg-white">
        <div className="flex flex-col lg:flex-row">
          <div className="relative h-[70vh] lg:h-screen lg:grow">
            <PlaceholderImage
              image={contact.image.responsiveImage}
              className="object-cover w-full h-full"
              layout="fill"
              overlappingTarget
            />
            <div className="absolute w-full h-[50vh] top-0 bg-gradient-to-b from-black/90 z-10" />
          </div>
          <div
            className="w-5xl py-20 px-10 lg:w-[700px] lg:h-screen lg:flex lg:items-center lg:pl-12"
            ref={ref}
          >
            <motion.div
              animate={contentIsInView && 'visible'}
              initial="hidden"
              variants={variants}
              className="md:grid md:grid-cols-2 gap-12 lg:gap-16 items-start"
            >
              {contact.blocks.map((block) => (
                <FooterBlock
                  key={block.id}
                  heading={block.heading}
                  body={block.body}
                  className="mb-8 lg:mb-0"
                />
              ))}
            </motion.div>
          </div>
        </div>
      </main>
    </Layout>
  );
}

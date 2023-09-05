import React, { useRef } from 'react';
import { useQuerySubscription } from 'react-datocms';
import { motion, useInView } from 'framer-motion';

import request from '@/lib/datocms';
import Layout from '@/components/layout';
import { responsiveImageFragment } from '@/lib/fragments';
import mainNavigationFragment from '@/components/navigation/fragment';
import footerBlockFragment from '@/components/footer-block/fragment';
import FooterBlock from '@/components/footer-block';
import PlaceholderImage from '@/components/placeholder-image';

export async function getStaticProps({ preview = false }) {
  const graphqlRequest = {
    query: `
          query contactPageContent {
            contact {
              image {
                responsiveImage(imgixParams: {fm: jpg, w: 2000 }) {
                  ...responsiveImageFragment
                }
              }
              blocks {
                ${footerBlockFragment}
              }
            }
            ${mainNavigationFragment}
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
    data: { contact, mainNavigation },
  } = useQuerySubscription(subscription);
  const ref = useRef(null);
  const contentIsInView = useInView(ref, {
    margin: '0px 0px 0px 0px',
  });

  return (
    <Layout mainNavigation={mainNavigation.links} hideFooter>
      <main className="bg-white">
        <h1 className="sr-only">Contact us</h1>
        <div className="flex flex-col lg:flex-row">
          <div className="relative h-[70vw] md:h-screen md:grow">
            <PlaceholderImage
              src={contact.image.responsiveImage.src}
              alt={contact.image.responsiveImage.alt}
              fill
              className="object-cover h-full"
            />
            <div className="absolute w-full h-[400px] top-0 bg-gradient-to-b from-black/90 z-10" />
          </div>
          <div
            className="w-5xl py-20 px-10 lg:w-[700px] lg:h-screen lg:flex lg:items-center lg:pl-12"
            ref={ref}
          >
            <motion.div
              animate={contentIsInView && 'visible'}
              initial="hidden"
              variants={variants}
              className="pt-24 md:grid md:grid-cols-2 gap-12 lg:gap-16 items-start"
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

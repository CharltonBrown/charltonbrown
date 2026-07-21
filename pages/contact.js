import React, { useRef, useState } from 'react';
import { useQuerySubscription } from 'react-datocms';
import { motion, useInView } from 'framer-motion';

import request from '@/lib/datocms';
import Layout from '@/components/layout';
import footerBlockFragment from '@/components/footer-block/fragment';
import FooterBlock from '@/components/footer-block';
import PlaceholderImage from '@/components/placeholder-image';
import Modal from '@/components/contact/Modal';
import ClientProjectForm from '@/components/contact/ClientProjectForm';
import PressEnquiryForm from '@/components/contact/PressEnquiryForm';

import useLayoutQuery from '@/hooks/useLayoutQuery';
import {
  responsiveImageFragment,
  metaTagsFragment,
  navigationFragment,
  globalSeoFragment,
} from '@/lib/fragments';

export async function getStaticProps({ preview = false }) {
  const graphqlRequest = {
    query: `
          query contactPageContent {
            ${globalSeoFragment}
            contact {
              seo: _seoMetaTags {
                ...metaTagsFragment
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
          ${metaTagsFragment}
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

const BUTTON_CLASS =
  'block w-full text-left border-b border-gallery py-4 text-sm font-savoyBold uppercase tracking-widest text-black hover:text-gray transition-colors';

export default function Contact({ subscription }) {
  const {
    data: { site, contact },
  } = useQuerySubscription(subscription);
  const { navigation, preview } = useLayoutQuery(subscription);
  const ref = useRef(null);
  const contentIsInView = useInView(ref, {
    margin: '0px 0px 0px 0px',
  });

  const [activeModal, setActiveModal] = useState(null);
  const [submitted, setSubmitted] = useState(null);

  const projectTriggerRef = useRef(null);
  const pressTriggerRef = useRef(null);

  const closeModal = () => setActiveModal(null);

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
            <div className="w-full">
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

              {/* Contact form triggers */}
              <div className="mt-12 border-t border-gallery">
                <button
                  ref={projectTriggerRef}
                  type="button"
                  className={BUTTON_CLASS}
                  onClick={() => setActiveModal('project')}
                >
                  Contact Us About A Project
                </button>
                <button
                  ref={pressTriggerRef}
                  type="button"
                  className={BUTTON_CLASS}
                  onClick={() => setActiveModal('press')}
                >
                  Press &amp; Other Enquiries
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Modal
        isOpen={activeModal === 'project'}
        onClose={closeModal}
        title="Contact Us About A Project"
        triggerRef={projectTriggerRef}
      >
        {submitted === 'project' ? (
          <SuccessMessage />
        ) : (
          <ClientProjectForm onSuccess={() => setSubmitted('project')} />
        )}
      </Modal>

      <Modal
        isOpen={activeModal === 'press'}
        onClose={closeModal}
        title="Press &amp; Other Enquiries"
        triggerRef={pressTriggerRef}
      >
        {submitted === 'press' ? (
          <SuccessMessage />
        ) : (
          <PressEnquiryForm onSuccess={() => setSubmitted('press')} />
        )}
      </Modal>
    </Layout>
  );
}

function SuccessMessage() {
  return (
    <div className="py-8">
      <p className="font-savoyBold text-lg mb-3">
        Thank you for getting in touch.
      </p>
      <p className="text-gray font-savoyRegular">
        We will respond within two working days.
      </p>
    </div>
  );
}

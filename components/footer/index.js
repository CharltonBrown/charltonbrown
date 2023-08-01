import React, { forwardRef, useRef } from 'react';
import clsx from 'clsx';
import { motion, useInView } from 'framer-motion';

import FooterNavigation from '@/components/footerNavigation';
import fadeVariants from '@/components/fadeInBlock/fadeVariants';

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

function FooterBlock({ children, className }) {
  return (
    <motion.div variants={fadeVariants} className={clsx(className, 'isolate')}>
      {children}
    </motion.div>
  );
}

const Footer = forwardRef(({ footerNavigation }, propRef) => {
  const dummyFooterRef = useRef(null);
  const footerRef = propRef !== null ? propRef : dummyFooterRef;
  const footerIsInView = useInView(footerRef, {
    margin: '0px 0px 0px 0px',
  });

  return (
    <>
      {!propRef && <div ref={dummyFooterRef} className="w-full h-screen" />}
      <footer
        className={clsx(
          footerIsInView ? 'visible' : 'invisible',
          'sticky bottom-0 w-full h-screen p-5 md:p-7 lg:p-10 bg-alabaster',
        )}
      >
        <div className="flex flex-col h-full">
          <motion.div
            animate={footerIsInView && 'visible'}
            initial="hidden"
            variants={variants}
            className="grow sm:grid sm:grid-cols-3 md:grid-cols-4 gap-16"
          >
            <FooterBlock className="flex flex-col justify-center text-xl">
              <h2 className="border-t border-gallery text-gray text-lg pt-4 mb-8">
                Address
              </h2>
              <p>2 Back Lane, Hampstead</p>
              <p>London NW3 1HL</p>
            </FooterBlock>
            <FooterBlock className="flex flex-col justify-center  text-xl">
              <h2 className="border-t border-gallery text-gray text-lg pt-4 mb-8">
                Contact
              </h2>
              <p>
                <a href="mailto:office@charltonbrown.com">
                  office@charltonbrown.com
                </a>
              </p>
              <p>
                <a href="tel:+44 (0)20 7794 1234">+44 (0)20 7794 1234</a>
              </p>
            </FooterBlock>
            <FooterBlock className="hidden lg:flex flex-col justify-center  text-xl">
              <h2 className="border-t border-gallery text-gray text-lg pt-4 mb-8">
                Information
              </h2>
              <p>
                <a href="/practice/">The practice</a>
              </p>
              <p>
                <a href="/practice/people/">People</a>
              </p>
            </FooterBlock>
            <FooterBlock className="flex flex-col justify-center text-xl">
              <h2 className="border-t border-gallery text-gray text-lg pt-4 mb-8">
                Social media
              </h2>
              <p>
                <a
                  href="https://www.instagram.com/charltonbrown_/"
                  target="_blank"
                >
                  Instagram opens in a new tab.
                </a>
              </p>
              <p>
                <a
                  href="https://www.linkedin.com/company/charlton-brown-architects"
                  target="_blank"
                >
                  LinkedIn, opens in a new tab.
                </a>
              </p>
            </FooterBlock>
          </motion.div>
          <FooterNavigation footerNavigation={footerNavigation} />
        </div>
      </footer>
    </>
  );
});
Footer.displayName = Footer;

export default Footer;

import React, { forwardRef, useRef } from 'react';
import clsx from 'clsx';
import { motion, useInView } from 'framer-motion';

import LegalNavigation from '@/components/legal-navigation';
import Container from '@/components/container';
import FooterBlock from '@/components/footer-block';

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

const Footer = forwardRef(
  ({ footer, legalNavigation, hideFooter }, propRef) => {
    const dummyFooterRef = useRef(null);
    const footerRef = propRef !== null ? propRef : dummyFooterRef;
    const footerIsInView = useInView(footerRef, {
      margin: '0px 0px 0px 0px',
    });

    if (hideFooter) return null;

    return (
      <>
        {!propRef && <div ref={dummyFooterRef} className="w-full h-screen" />}
        <footer
          className={clsx(
            footerIsInView ? 'visible' : 'invisible',
            'fixed bottom-0 w-full h-screen bg-alabaster',
          )}
        >
          <Container className="relative flex flex-col h-full justify-center">
            <motion.div
              animate={footerIsInView && 'visible'}
              initial="hidden"
              variants={variants}
              className="md:grid md:grid-cols-2 gap-12 lg:grid-cols-4 lg:gap-16 items-start"
            >
              {footer.blocks.map((block) => (
                <FooterBlock
                  key={block.id}
                  heading={block.heading}
                  body={block.body}
                  className="mb-8 md:mb-0"
                />
              ))}
            </motion.div>
            <LegalNavigation
              legalNavigation={legalNavigation}
              className="absolute bottom-8"
            />
          </Container>
        </footer>
      </>
    );
  },
);
Footer.displayName = Footer;

export default Footer;

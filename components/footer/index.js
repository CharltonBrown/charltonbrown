import React, { useEffect, useRef } from 'react';
import clsx from 'clsx';
import { motion, useInView } from 'framer-motion';
import { useContextSelector } from 'use-context-selector';

import LegalNavigation from '@/components/legal-navigation';
import Container from '@/components/container';
import FooterBlock from '@/components/footer-block';

import navContext from '@/lib/context/navContext';

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

const Footer = ({ footer, legalNavigation, hideFooter }) => {
  const ref = useRef(null);
  const footerIsInView = useInView(ref);
  const setNavContext = useContextSelector(navContext, (v) => v[1]);

  useEffect(() => {
    if (footerIsInView) {
      setNavContext((s) => ({
        ...s,
        navVisibility: 'hidden',
      }));
    } else {
      setNavContext((s) => ({
        ...s,
        navVisibility: 'visible',
      }));
    }
  }, [setNavContext, footerIsInView]);

  if (hideFooter) return null;

  return (
    <>
      <div ref={ref} className="w-full h-screen" />
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
            className="md:absolute bottom-8"
          />
        </Container>
      </footer>
    </>
  );
};

export default Footer;

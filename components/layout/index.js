import React, { useEffect } from 'react';
import Head from 'next/head';
import { useContextSelector } from 'use-context-selector';
import clsx from 'clsx';
import { motion } from 'framer-motion';

import Navigation from '@/components/navigation';
import Footer from '@/components/footer';
import navContext from '@/lib/context/navContext';
import scrollSnapContext from '@/lib/context/scrollSnapContext';

const variants = {
  hidden: { opacity: 0 },
  enter: { opacity: 1 },
  exit: { opacity: 0 },
};

export default function Layout({
  children,
  mainNavigation,
  footer,
  title,
  legalNavigation,
  hideFooter,
  hideHeader,
}) {
  const setNavColor = useContextSelector(navContext, (v) => v[1]);
  const scrollSnap = useContextSelector(scrollSnapContext, (v) => v[0].active);

  useEffect(() => {
    setNavColor((s) => ({
      ...s,
      logoTheme: 'dark',
      linksTheme: 'dark',
    }));
  }, [setNavColor]);

  return (
    <>
      <Head>
        <title>{title ? `${title} - Charlton Brown` : 'Charlton Brown'}</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <div className={clsx(scrollSnap && 'overflow-hidden h-screen')}>
        <Navigation navigation={mainNavigation} hideHeader={hideHeader} />
        <motion.div
          variants={variants}
          initial="hidden"
          animate="enter"
          exit="exit"
          transition={{ type: 'ease', duration: 0.5 }}
          className="relative z-10"
        >
          {children}
        </motion.div>
        <Footer
          footer={footer}
          legalNavigation={legalNavigation}
          hideFooter={hideFooter}
        />
      </div>
    </>
  );
}

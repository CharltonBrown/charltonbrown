import React, { useEffect } from 'react';
import Head from 'next/head';
import { useContextSelector } from 'use-context-selector';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import Script from 'next/script';
import Link from 'next/link';
import { renderMetaTags } from 'react-datocms';

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
  navigation: {
    mainNavigation,
    footer,
    legalNavigation,
    aboutUsNavigation,
    projectTypesNav,
  },
  hiddenPageHeading,
  hideFooter,
  hideHeader,
  hideNavOnLoad,
  preview,
  site,
  seo,
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

  const title = seo.find((item) => item.tag === 'title').content;

  return (
    <>
      <Head>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        {renderMetaTags([...seo, ...site.favicon])}
      </Head>
      {hiddenPageHeading && <h1 className="sr-only">{title}</h1>}
      <div className={clsx(scrollSnap && 'overflow-hidden h-screen')}>
        <Navigation
          navigation={mainNavigation}
          aboutUsNavigation={aboutUsNavigation}
          projectTypesNav={projectTypesNav}
          hideHeader={hideHeader}
          hideNavOnLoad={hideNavOnLoad}
        />
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
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-7W544HKPZK" />
        <Script id="google-analytics">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
  
            gtag('config', 'G-7W544HKPZK');
          `}
        </Script>
        {/* <Script
          id="hs-script-loader"
          async
          defer
          src="//js.hs-scripts.com/47875486.js"
        /> */}
      </div>
      {preview && (
        <div className="fixed z-50 bottom-0 left-0 right-0 bg-casablanca text-white p-4">
          <p>
            Preview mode is active. You can view real-time updates of draft
            content. Exit preview mode{' '}
            <Link href="/api/exit-preview" className="underline">
              here
            </Link>
            .
          </p>
        </div>
      )}
    </>
  );
}

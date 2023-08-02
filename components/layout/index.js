import React, { useEffect } from 'react';
import Head from 'next/head';
import { useContextSelector } from 'use-context-selector';
import clsx from 'clsx';

import Navigation from '@/components/navigation';
import Footer from '@/components/footer';
import navColorContext from '@/lib/context/navColorContext';
import scrollSnapContext from '@/lib/context/scrollSnapContext';

export default function Layout({
  children,
  mainNavigation,
  footer,
  title,
  legalNavigation,
  footerRef,
  hideFooter,
  hideHeader,
}) {
  const setNavColor = useContextSelector(navColorContext, (v) => v[1]);
  const scrollSnap = useContextSelector(scrollSnapContext, (v) => v[0].active);

  useEffect(() => {
    setNavColor((s) => ({
      ...s,
      theme: 'dark',
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
        <div className="relative z-10">{children}</div>
        <Footer
          footer={footer}
          legalNavigation={legalNavigation}
          ref={footerRef}
          hideFooter={hideFooter}
        />
      </div>
    </>
  );
}

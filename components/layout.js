import React, { useEffect } from 'react';
import Head from 'next/head';
import { useContextSelector } from 'use-context-selector';

import Navigation from '@/components/navigation';
import Footer from '@/components/footer';
import navColorContext from '@/lib/context/navColorContext';

export default function Layout({
  children,
  footerNavigation,
  mainNavigation,
  title,
}) {
  const setNavColor = useContextSelector(navColorContext, (v) => v[1]);

  useEffect(() => {
    setNavColor((s) => ({
      ...s,
      theme: 'dark',
    }));
  }, []);

  return (
    <>
      <Head>
        <title>{title ? `${title} - Charlton Brown` : 'Charlton Brown'}</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Navigation navigation={mainNavigation} />
      <main className="relative bg-white z-30">{children}</main>
      <Footer footerNavigation={footerNavigation} />
    </>
  );
}

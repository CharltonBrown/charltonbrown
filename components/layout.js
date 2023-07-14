import React from 'react';
import Head from 'next/head';

import Navigation from '@/components/navigation';
import Footer from '@/components/footer';

export default function Layout({
  children,
  footerNavigation,
  mainNavigation,
  title,
}) {
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

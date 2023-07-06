import React from 'react';
import Head from 'next/head';

export default function Layout({ children, title }) {
  return (
    <>
      <Head>
        <title>{title} - Charlton Brown</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <main className="font-serif">{children}</main>
    </>
  );
}

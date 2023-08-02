import React, { useState } from 'react';
import NProgress from 'nprogress';
import Router from 'next/router';
import 'nprogress/nprogress.css';
import '../styles/global.css';
import '../styles/fonts.css';

import navColorContext from '@/lib/context/navColorContext';
import scrollSnapContext from '@/lib/context/scrollSnapContext';

NProgress.configure({ showSpinner: false });

Router.events.on('routeChangeStart', () => {
  NProgress.start();
});
Router.events.on('routeChangeComplete', () => {
  NProgress.done();
});

const StateProvider = ({ children }) => (
  <navColorContext.Provider value={useState({ theme: 'dark' })}>
    <scrollSnapContext.Provider value={useState({ active: false })}>
      {children}
    </scrollSnapContext.Provider>
  </navColorContext.Provider>
);

function MyApp({ Component, pageProps }) {
  return (
    <StateProvider>
      <Component {...pageProps} />
    </StateProvider>
  );
}

export default MyApp;

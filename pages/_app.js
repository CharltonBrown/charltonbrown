import React, { useState } from 'react';
import NProgress from 'nprogress';
import Router from 'next/router';
import { AnimatePresence } from 'framer-motion';
import 'nprogress/nprogress.css';
import '../styles/global.css';
import '../styles/fonts.css';

import navContext from '@/lib/context/navContext';
import scrollSnapContext from '@/lib/context/scrollSnapContext';

NProgress.configure({ showSpinner: false });

Router.events.on('routeChangeStart', () => {
  NProgress.start();
});
Router.events.on('routeChangeComplete', () => {
  NProgress.done();
});

const StateProvider = ({ children }) => (
  <navContext.Provider
    value={useState({
      navVisibility: 'visible',
      logoTheme: 'dark',
      linksTheme: 'dark',
    })}
  >
    <scrollSnapContext.Provider value={useState({ active: false })}>
      {children}
    </scrollSnapContext.Provider>
  </navContext.Provider>
);

function MyApp({ Component, pageProps, router }) {
  return (
    <StateProvider>
      <AnimatePresence mode="wait" onExitComplete={() => window.scrollTo(0, 0)}>
        <Component {...pageProps} key={router.pathname} />
      </AnimatePresence>
    </StateProvider>
  );
}

export default MyApp;

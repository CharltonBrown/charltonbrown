import React, { useState } from 'react';
import '../styles/global.css';
import '../styles/fonts.css';

import navColorContext from '@/lib/context/navColorContext';

const StateProvider = ({ children }) => (
  <navColorContext.Provider value={useState({ theme: 'dark' })}>
    {children}
  </navColorContext.Provider>
);

function MyApp({ Component, pageProps }) {
  return (
    <StateProvider>
      <Component {...pageProps} />;
    </StateProvider>
  );
}

export default MyApp;

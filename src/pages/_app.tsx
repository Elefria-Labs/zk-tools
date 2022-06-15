import React from 'react';

import { AppProps } from 'next/app';
import '../styles/global.css';
import '@firebase/firebase-config';
import { ChakraProvider } from '@chakra-ui/react';

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <ChakraProvider resetCSS>
      {/* @ts-ignore */}
      <Component {...pageProps} />
    </ChakraProvider>
  );
};
export default MyApp;

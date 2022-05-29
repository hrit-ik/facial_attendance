import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Cookies from 'js-cookie';
import {useState} from 'react';
import Link from 'next/link';
import { ApolloProvider } from "@apollo/client";
import client from '../apollo-client';

function MyApp({ Component, pageProps }: AppProps) {
  return(
    <ApolloProvider client={client}>
      <Component {...pageProps}/>
    </ApolloProvider>
  )
}

export default MyApp

import React from 'react'
import Chatbot from '@/src/components/chatbot';
import ScraperForm from '@/src/components/scrapForm';
import "@/src/styles/global.css";
import type { AppProps } from 'next/app';

export default function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}
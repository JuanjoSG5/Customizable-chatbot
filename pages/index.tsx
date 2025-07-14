import React from 'react';
import Chatbot from '@/src/components/chatbot';
import ScraperForm from '@/src/components/scrapForm';


export default function Home() {
  return (
    <main className="flex flex-col content-center items-center justify-center min-h-screen mx-auto p-4 lg:max-w-4xl md:max-w-2xl">
      <h1 className='text-3xl font-bold mb-4 py-4'>Customizable Chatbot with RAG</h1>
      <p className='text-xl mb-4'>
        To use this chatbot, first you need to add the website you want to scrape to look for information. Then decide on the depth of the crawl (the amount of pages it will go through to collect the information)
        After that, you can start chatting with the AI and it will use the information from the website to answer your questions. Click the button at the bottom right corner to begin chatting. 
      </p>
      <ScraperForm />
      <Chatbot />
    </main>
  );
}
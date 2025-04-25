import React from 'react';
import Chatbot from '@/src/components/chatbot';
import ScraperForm from '@/src/components/scrapForm';

export default function Home() {
  return (
    <main>
      <h1>Customizable Chatbot with RAG</h1>
      <p>
        The goal of this project is to create a chatbot that is easy to use
        locally, and gives good results when asking for information about any
        page. 
      </p>
      <ScraperForm />
      <Chatbot />
    </main>
  );
}
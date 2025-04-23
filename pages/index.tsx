import React from 'react';
import Chatbot from '@/src/components/chatbot';
import ScraperForm from '@/src/components/scrapForm';

export default function Home() {
  return (
    <main>
      <h1>AI Chatbot with RAG</h1>
      <ScraperForm />
      <Chatbot />
    </main>
  );
}
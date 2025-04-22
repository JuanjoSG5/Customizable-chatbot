import React from 'react'
import Chatbot from '@/src/components/chatbot';
import ScraperForm from '@/src/components/scrapForm';

export default function App() {
  return (
    <main>
      <ScraperForm />
      <Chatbot />
    </main>
  );
}
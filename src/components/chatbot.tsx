import React, { useState } from 'react';
import { pipeline } from '@xenova/transformers';
import { retrieve, loadDocuments } from '@/src/utils/embeddings';

const Chatbot = async () => {
  const [messages, setMessages] = useState([
    { role: 'system', content: 'You are a helpful assistant.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const docs = await loadDocuments('@/data'); // Cargar documentos al iniciar

  const handleSend = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);
	const userQuestion = newMessages[newMessages.length - 1].content

    try {
        const extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
        const qOut = await extractor(
			userQuestion, 
          { pooling: 'mean', normalize: true }
        );
        const queryEmb = Array.from(qOut.data);
      
        // Recuperar documentos
        const topDocs = retrieve(docs, queryEmb);
        const contextText = topDocs.map(d => `Fuente [${d.id}]:\n${d.text}`).join('\n\n');
      
        // Llamada a OpenRouter con Gemini
        const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENROUTER_TOKEN}`,
            'X-Title': 'ChatbotApp',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'google/gemini-flash-1.5',
            messages: [
              { role: 'system', content: `Utiliza este contexto para responder:\n${contextText}` },
              { role: 'user', content: userQuestion }
            ]}),
		  })
      const data = await res.json();
      const reply = data.choices?.[0]?.message;

      if (reply) {
        setMessages([...newMessages, reply]);
      }
    } catch (err) {
      console.error('Error fetching reply:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chatbot">
      <div className="messages">
        {messages
          .filter((msg) => msg.role !== 'system')
          .map((msg, idx) => (
            <div key={idx} className={`message ${msg.role}`}>
              <strong>{msg.role}:</strong> {msg.content}
            </div>
          ))}
      </div>

      <div className="input-area">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Type your message..."
        />
        <button onClick={handleSend} disabled={loading}>
          {loading ? 'Sending...' : 'Send'}
        </button>
      </div>
    </div>
  );
};

export default Chatbot;

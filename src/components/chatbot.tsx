import React, { useState, useEffect } from 'react';
import { pipeline } from '@xenova/transformers';
import { retrieve } from '@/src/utils/embeddings';

const Chatbot = () => {
  const [messages, setMessages] = useState([
    { role: 'system', content: 'You are a helpful assistant.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [docs, setDocs] = useState([]);// Cargar documentos al iniciar

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        const response = await fetch('/api/documents');
        const docsData = await response.json();
        setDocs(docsData);
      } catch (error) {
        console.error('Error fetching documents:', error);
      }
    };
    
    fetchDocs();
  }, []);

  const handleSend = async () => {
	if (!input.trim()) return;
  
	const newMessages = [...messages, { role: 'user', content: input }];
	setMessages(newMessages);
	setInput('');
	setLoading(true);
  
	try {
	  const res = await fetch('/api/chat', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ question: input })
	  });
	  const data = await res.json();
	  
	  if (data.reply) {
		setMessages([...newMessages, data.reply]);
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

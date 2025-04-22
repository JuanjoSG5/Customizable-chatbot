import React, { useState, useEffect } from "react";
import { setupRag } from "../features/Chatbot/create_rag";

const Chatbot = () => {
  const [messages, setMessages] = useState([
    { role: "system", content: "You are a helpful assistant." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [ragChain, setRagChain] = useState(null);
  const [model, setModel] = useState(null);

  useEffect(() => {
    const initializeRag = async () => {
      try {
        const response = await fetch("/api/setup_rag");
        const data = await response.json();
        if (data.success) {
          console.log("RAG setup successful");
        }
      } catch (error) {
        console.error("Failed to initialize RAG:", error);
      }
    };

    initializeRag();
  }, []);

  const handleSend = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: input }),
      });
      const data = await res.json();

      if (data.reply) {
        setMessages([...newMessages, data.reply]);
      }
    } catch (err) {
      console.error("Error fetching reply:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chatbot">
      <div className="messages">
        {messages
          .filter((msg) => msg.role !== "system")
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
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Type your message..."
        />
        <button onClick={handleSend} disabled={loading}>
          {loading ? "Sending..." : "Send"}
        </button>
      </div>
    </div>
  );
};

export default Chatbot;

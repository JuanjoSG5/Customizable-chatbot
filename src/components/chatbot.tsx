import React, { useState, useEffect } from "react";

const Chatbot = () => {
  const [messages, setMessages] = useState([
    { role: "system", content: "You are a helpful assistant." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSetupComplete, setIsSetupComplete] = useState(false);

  useEffect(() => {
    const initializeRag = async () => {
      try {
        const response = await fetch("/api/setup_rag");
        const data = await response.json();
        if (data.success) {
          setIsSetupComplete(true);
          console.log("RAG setup successful");
        }
      } catch (error) {
        console.error("Failed to initialize RAG:", error);
      }
    };

    initializeRag();
  }, []);

  const handleSend = async () => {
    if (!input.trim() || !isSetupComplete) return;

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

      // Check if we received a reply and properly format it
      if (data.reply) {
        // Make sure the reply is in the expected format
        const assistantMessage = {
          role: data.reply.role || "assistant", 
          content: data.reply.content || String(data.reply)
        };
        
        setMessages([...newMessages, assistantMessage]);
        
        // Debug the received message
        console.log("Received message:", data.reply);
      } else {
        // Add an error message if no reply was received
        setMessages([
          ...newMessages, 
          { role: "assistant", content: "Sorry, I couldn't process your request." }
        ]);
        console.error("No reply received from API:", data);
      }
    } catch (err) {
      console.error("Error fetching reply:", err);
      // Add an error message on exception
      setMessages([
        ...newMessages, 
        { role: "assistant", content: "An error occurred. Please try again." }
      ]);
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
          placeholder={isSetupComplete ? "Type your message..." : "Setting up RAG..."}
          disabled={!isSetupComplete || loading}
        />
        <button onClick={handleSend} disabled={!isSetupComplete || loading}>
          {loading ? "Sending..." : "Send"}
        </button>
      </div>
    </div>
  );
};

export default Chatbot;
import React, { useState, useEffect } from "react";
import Chat from "@/src/components/chat";
import TextBox from "@/src/components/textBox";
import CloseIcon from "./icons/closeIcon";

const Chatbot = () => {
  const [messages, setMessages] = useState([
    { role: "system", content: "You are a helpful assistant." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSetupComplete, setIsSetupComplete] = useState(false);
  const [hidden, setHidden] = useState(true);

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

  const onClick = () => {
    setHidden(!hidden);
  };

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

      if (data.reply) {
        const assistantMessage = {
          role: data.reply.role || "assistant",
          content: data.reply.content || String(data.reply),
        };

        setMessages([...newMessages, assistantMessage]);
        console.log("Received message:", data.reply);
      } else {
        setMessages([
          ...newMessages,
          {
            role: "assistant",
            content: "Sorry, I couldn't process your request.",
          },
        ]);
        console.error("No reply received from API:", data);
      }
    } catch (err) {
      console.error("Error fetching reply:", err);
      setMessages([
        ...newMessages,
        { role: "assistant", content: "An error occurred. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {!hidden ? (
        <div className="fixed bottom-4 right-4 flex flex-col gap-2 p-4 w-[350px] h-[525px] bg-white border border-gray-300 rounded-lg shadow-lg">
          <div className="flex justify-between items-center text-2xl">
            AI Assistant
            <span>
              <CloseIcon onClick={onClick} />
            </span>
          </div>
          <Chat messages={messages} loading={loading} />

          <TextBox
            input={input}
            setInput={setInput}
            handleSend={handleSend}
            isSetupComplete={isSetupComplete}
            loading={loading}
          />
        </div>
      ) : (
        <button
          onClick={onClick}
          className="fixed z-[1000] bottom-[3vh] right-[3vw]"
        >
          <img className="size-18" src="logo.png" alt="Chat with the AI" />
        </button>
      )}
    </>
  );
};

export default Chatbot;

import { useState, useEffect, useRef } from "react";
import Chat from "@/src/components/chat";
import TextBox from "@/src/components/textBox";
import { useRouter } from "next/router";
import { send } from "node:process";
import { readStream } from "../utils/readStream";
import { supabase } from "../utils/supabase";

const Chatbot = ({ chatId }: { chatId: string }) => {
  const router = useRouter();
  const { q } = router.query;
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hi! I am your AI Assistant. Once you train me with a website, you can ask me anything about it."
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const hasHandledInitialQuery = useRef(false);
  // TODO: Setting this to true for testing purposes
  const [isSetupComplete, setIsSetupComplete] = useState(true);

  

  useEffect(() => {
    if (!router.isReady || hasHandledInitialQuery.current) return;
    
    const queryMessage = router.query.q as string | undefined;
    
    if (!queryMessage) return;

    hasHandledInitialQuery.current = true;
    sendSingleMessage(queryMessage);
    router.replace(`/u/${chatId}`, undefined, { shallow: true });
  }, [router.isReady, loading]);

  // Load chat history from Supabase
  useEffect(() => {
    if (!chatId || !router.isReady) return;

    const loadChatHistory = async () => {
      const { data, error } = await supabase
        .from('messages')
        .select('role, content')
        .eq('chat_id', chatId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error("Error loading chat history:", error);
        return;
      }

      if (data && data.length > 0) {
        setMessages(data);
      }
    };

    loadChatHistory();
  }, [chatId, router.isReady]);


  const sendSingleMessage = async (message: string) => {
    if (!message.trim()) return;

    setMessages((prev) => [...prev, { role: "user", content: message }]);
    setLoading(true);

    await supabase
    .from('messages')
    .insert({ chat_id: chatId, role: 'user', content: message });
  

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: message, chatId }),
      });

      if (!res.ok) throw new Error("Web Error");
      if (!res.body) throw new Error("No body");

      let isFirstRealChunk = true;

      for await (const chunk of readStream(res)) {
        if (chunk.text && chunk.text !== "") {
          if (isFirstRealChunk) {
            setLoading(false);
            setMessages((prev) => [...prev, { role: "assistant", content: chunk.text }]);
            isFirstRealChunk = false;
          } else {
            setMessages((prevMessages) => {
              const updatedMessages = [...prevMessages];
              updatedMessages[updatedMessages.length - 1].content += chunk.text;
              return updatedMessages;
            });

            supabase
              .from("chats")
              .insert({ chat_id: chatId, role: 'assistant', content: chunk.text });
          }
        }
      }

      if (isFirstRealChunk) {
        setLoading(false);
        setMessages((prev) => [...prev, { role: "assistant", content: "Lo siento, el servidor no ha respondido." }]);
      }

      
    } catch (err) {
      console.error("Error fetching reply:", err);
      setLoading(false);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Ocurrió un error. Por favor, inténtalo de nuevo." },
      ]);
    } 

  };

  const handleSend = () => {
    if (!input.trim() || loading) return;
    sendSingleMessage(input);
    setInput("");
  };


  return (
    <div className="flex flex-col h-full w-full bg-white dark:bg-slate-900 transition-colors duration-300">

      { /* This is going to be the header of the current chat */}
      <div className="
        flex 
        items-center justify-between
        bg-white/50 dark:bg-slate-950/50 
        px-6 py-4 
        border-b border-slate-100 dark:border-slate-800 
        backdrop-blur-sm
        z-10 
        sticky top-0
        transition-colors duration-300
      ">
        <h2 className="
          flex 
          items-center 
          gap-2 
          text-base font-semibold 
          text-slate-800 dark:text-slate-200

        ">
          Live Assistant
        </h2>
        <div className="flex items-center gap-2">
          <span className="relative flex h-3 w-3">
            <span className={isSetupComplete ? "animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" : "hidden"}></span>
            <span className={`relative inline-flex rounded-full h-3 w-3 ${isSetupComplete ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
          </span>
          <p className="text-slate-400 text-xs mt-1">
            {isSetupComplete ? "RAG Engine Ready" : "Initializing Vector Store..."}
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scroll-smooth bg-slate-50 dark:bg-slate-900/50 p-4 transition-colors duration-300">
        <Chat messages={messages} loading={loading} />
      </div>

      <div className="
        w-full 
        bg-gradient-to-t from-white to-transparent
        dark:from-slate-900/50 dark:to-transparent
        py-6 px-4
      ">
        <TextBox
          input={input}
          setInput={setInput}
          handleSend={handleSend}
          isSetupComplete={isSetupComplete}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default Chatbot;
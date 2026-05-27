import { useEffect, useState } from "react";
import CustomInput from "@/src/components/input";
import { useRouter } from "next/router";
import { createNewChat } from "../features/chats/create_chat";
import CloseIcon from "./icons/closeIcon";

// Using String or null here so that once the form is submitted and we dont have the id
// we can generate a new one and pass it to the chatbot component
const ScraperForm = ({
  chatId,
  isOpen,
  setIsOpen
}: {
  chatId: string | null,
  isOpen: boolean,
  setIsOpen: (isOpen: boolean) => void
}) => {
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [depth, setDepth] = useState(10);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("Creating new chat...");

    let currentChatId = chatId;
    let isNewChat = false;

    try {
      if (!currentChatId) {
        currentChatId = await createNewChat();
        isNewChat = true;
      }

      const res = await fetch("/api/scrape_post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, depth, chatId: currentChatId }),
      });

      if (!res.ok) {
        throw new Error("Error en la petición HTTP al servidor", { cause: await res.text() });
      }

      if (!res.body) {
        throw new Error("Response body is empty");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();

        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        const lines = buffer.split('\n');
        buffer = lines.pop() ?? "";

        for (let line of lines) {
          if (!line.trim()) continue;
          if (line.startsWith("data:")) {
            line = line.substring(5).trim();
          }

          try {
            const data = JSON.parse(line);

            // Update the UI dynamically with the current URL being scraped
            switch (data.type) {
              case "progress":
                setMessage(data.message);
                break;
              case "done":
                setMessage(data.message);
                break;
              case "error":
                setError(data.message);
                break;
            }
          } catch (parseError) {
            console.error("Failed to parse JSON chunk:", line, parseError);
          }
        }
      }

      if (isNewChat && currentChatId) {
        router.push(`/u/${currentChatId}`);
      }
    } catch (err) {
      setError(err.message || "Fallo inesperado");
      setMessage("");
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <aside className={`
        flex flex-col 
        h-screen 
        border-l border-slate-200 
        dark:border-slate-800 
        bg-white 
        dark:bg-slate-950 
        transition-all duration-300 ease-in-out ${
        isOpen ? "w-80" : "w-0 border-none overflow-hidden"
      }`}
    >
<form
      className="flex flex-col h-full w-80 p-6 overflow-y-auto"
      onSubmit={handleSubmit}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="flex items-center text-2xl font-semibold text-slate-800 dark:text-slate-100 gap-3">
          Train your AI Assistant
        </h2>
        <button 
          type="button" 
          onClick={() => setIsOpen(!isOpen)}
          className="text-slate-400 hover:text-slate-600 dar:hover:text-slate-200"
          title="Close scraping form"
        >
          <CloseIcon/>
        </button>
      </div>
      
      

      <div className="flex flex-col gap-5">
        <CustomInput id="urlInput" text="Website URL" value={url} setValue={setUrl} />
        <CustomInput id="depthInput" text="Crawl Depth" value={depth} setValue={setDepth} />

        <button
          disabled={loading}
          className="
            w-full
            mt-2 
            px-4 py-3
            bg-blue-600 
            text-white font-medium 
            rounded-lg
            disabled:opacity-50 
            transition-all active:scale-[0.98] hover:bg-blue-700 
            shadow-sm"
          type="submit"
        >
          {loading ? "Processing..." : "Scrape and Save"}
        </button>
      </div>

      {message && (
        <p className="
          mt-6 p-3 
          bg-green-50 
          dark:bg-green-900/30 
          border border-green-200 rounded-xl
          dark:border-green-800 
          text-sm text-center text-green-700 
          font-medium
          dark:text-green-400 
          break-words
        ">
          {message}
        </p>
      )}
      {error && (
        <p className="
          mt-6 p-3 
          bg-red-50 
          dark:bg-red-900/30 
          border border-red-200 rounded-xl 
          dark:border-red-800 
          text-sm text-center text-red-700 
          font-medium
          dark:text-red-400
          break-words
        ">
          {error}
        </p>
      )}
    </form>
    </aside>
    
  );
};


export default ScraperForm;
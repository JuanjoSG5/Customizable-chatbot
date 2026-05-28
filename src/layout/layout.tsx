import ChatHistory from "./chatHistory";
import { useState } from "react";
import ScraperForm from "../components/scrapForm";
import ThemeToggle from "../components/themeToggle";
import ScrapperIcon from "../components/icons/scrapperIcon";

export default function Layout(
  {
    children,
    chatId = null  
  }: {
    children: React.ReactNode,
    chatId: string | null 
}) {
  const [isChatHistoryOpen, setIsChatHistoryOpen] = useState(false);
  const [isScraperFormOpen, setIsScraperFormOpen] = useState(false);

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300 overflow-hidden">


      <ChatHistory
        isOpen={isChatHistoryOpen}
        setIsOpen={setIsChatHistoryOpen}
      />

      <div className="flex-1 flex flex-col min-w-0 h-screen relative">
        <div className="
          flex items-center justify-between 
          h-14 w-full 
          px-6 
          border-b border-slate-200 dark:border-slate-800
          bg-white dark:bg-slate-950
          backdrop-blur-sm
          z-10
        ">
          <h1 className="font-bold text-slate-800 dark:text-slate-200 tracking-tight">
            AI Knowledge Base
          </h1>

          <div className="flex items-center gap-4">
            <ThemeToggle/>

            {
              chatId && !isScraperFormOpen && (
                <button
                  onClick={() => setIsScraperFormOpen(true)}
                  className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors duration-300"
                  title="Open Scraping Form"
                  >
                    <ScrapperIcon/>
                  </button>
            )}
          </div>
          
        </div>

        {/* Page content */}
        <main className="flex-1 flex  flex-col w-full h-full relative overflow-hidden">
          {children}
        </main>
      </div>
      <ScraperForm
        chatId={chatId}
        isOpen={isScraperFormOpen}
        setIsOpen={setIsScraperFormOpen}
      />
    </div>
  );
}
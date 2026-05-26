import Header from "./header";
import ChatHistory from "./chatHistory";
import { useState } from "react";
import ScraperForm from "../components/scrapForm";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isChatHistoryOpen, setIsChatHistoryOpen] = useState(false);
  const [isScraperFormOpen, setIsScraperFormOpen] = useState(true);

  return (
    // Cambiamos a flex-row para poner Sidebar a la izq y contenido a la der
    <div className="flex h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300 overflow-hidden">


      <ChatHistory
        isOpen={isChatHistoryOpen}
        setIsOpen={setIsChatHistoryOpen}
      />



      <div className="flex-1 flex flex-col min-w-0 h-screen relative">
        <Header />

        {/* Page content */}
        <main className="flex-1 flex  flex-col w-full h-full relative overflow-hidden">
          {children}
        </main>
      </div>
      <ScraperForm
        chatId={null}
        isOpen={isScraperFormOpen}
        setIsOpen={setIsScraperFormOpen}
      />
    </div>
  );
}


// This is a skeleton component for the chat workspace. 
export default function ChatWorkspace({ chatId }: { chatId: string | null }) {
  return (
    <div className="flex h-screen">
      {/* Sidebar Izquierda - Historial */}
      <Sidebar />

      {/* Centro - Chat */}
      <main className="flex-1">
        {chatId ? <Chatbot chatId={chatId} /> : <WelcomeMessage />}
      </main>

      {/* Derecha - Scraper (Desplegable) */}
      <aside className={`w-80 ${isScraperOpen ? 'block' : 'hidden'}`}>
        <ScraperForm chatId={chatId} />
      </aside>
    </div>
  );
}
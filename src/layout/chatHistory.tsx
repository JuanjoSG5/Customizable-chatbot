import React, { useEffect, useState } from "react"
import { loadChats } from "../features/chats/load_chats"
import { useRouter } from "next/router"
import { Chat } from "../types/chat"

export default function ChatHistory({ 
    isOpen,
    setIsOpen 
}: { 
    isOpen: boolean, 
    setIsOpen: (isOpen: boolean) => void 
}) {
    const nextRouter = useRouter()
    const { chatId } = nextRouter.query

    const [mounted, setMounted] = useState(false)
    const [chats, setChats] = useState<Chat[]>([])
    
    useEffect(() => {
        const loadChatsData = async () => {
            setMounted(true)
            try {
                const chatsData = await loadChats()
                setChats(chatsData || [])
            } catch (error) {
                console.error("Error al cargar los chats:", error)
            }
        }
        loadChatsData()
    }, [])

    const handleChatClick = (chatId: string) => {
        nextRouter.push(`/u/${chatId}`);
    }

    const handleNewChat = () => {
        // For now we jsut redirect to the home page, where we create the new chat
        nextRouter.push(`/`);
    }
    if (!mounted) return <div className="w-16 h-screen bg-slate-900 border-r border-slate-600" /> 

    return (
        <aside 
            className={`
                h-screen 
                bg-slate-900 text-slate-300 
                flex flex-col 
                border-r border-slate-600 
                transition-all duration-300 ease-in-out 
                select-none 
                ${isOpen ? "w-64" : "w-16"}
            `}>

            {/* Toggle button */}
            <div className={`p-4 flex items-center ${isOpen ? "justify-between" : "justify-center" }`}>
                {isOpen && <h2 className="text-lg font-semibold">Chats</h2>}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors duration-300"
                    title={isOpen ? "Close menu" : "Open Menu"}
                >
                    {isOpen ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                            </svg>
                        )}
                </button>
            </div>
            
            {/* New Chat Button */}
            <div className="px-3 py-2">
                <button 
                    onClick={handleNewChat}
                    className={`
                        w-full 
                        flex items-center gap-3 
                        p-3 
                        rounded-xl 
                        border borde-slate-700 
                        hover:bg-slate-800 hover:border-slate-600 
                        text-slate-2 
                        transition-all active:scale-[0.98] 
                        ${isOpen ? "justify-start" : "justify-center"}
                    `}>
                        <span className="font-bold text-lg">+</span>
                        {isOpen && <span className="text-sm font-medium">New Chat</span>}
                </button>
            </div>
            
            <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
                {isOpen && chats.length > 0 && (
                    <span className="px-3 py-2 text-xs font-semibold text-slate-500 block">Tus conversaciones</span>
                )}
                
                {chats.map(chat => {
                    const isActive = chat.id === chatId;

                    return (
                        <div 
                            key={chat.id}
                            onClick={() => handleChatClick(chat.id)}
                            className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${
                                isActive 
                                    ? "bg-slate-800 text-white font-medium shadow-sm border border-slate-700" 
                                    : "text-slate-400 hover:bg-slate-800/40 hover:text-slate-200"
                            }`}
                        >                            
                            {isOpen && (
                                <span className="text-sm truncate w-full block">
                                    {chat.name}
                                </span>
                            )}
                        </div>
                    );
                })}

                {chats.length === 0 && isOpen && (
                    <p className="text-xs text-slate-500 text-center py-4">No tienes chats guardados</p>
                )}
            </div>
        </aside>
    )
    
}
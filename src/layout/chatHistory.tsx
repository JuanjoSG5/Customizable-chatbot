import React, { useEffect, useState } from "react"
import { loadChats } from "../features/chats/load_chats"
import router from "next/router"

export default function ChatHistory({ 
    isOpen,
    setIsOpen 
}: { 
    isOpen: boolean, 
    setIsOpen: (isOpen: boolean) => void 
}) {
    const [mounted, setMounted] = useState(false)
    const [chats, setChats] = useState<Chat[]>([])
    
    useEffect(() => {
        const loadChatsData = async () => {
            setMounted(true)
            try {
                const chatsData = await loadChats()
                console.log("Chats cargados:", chatsData)
                setChats(chatsData || [])
            } catch (error) {
                console.error("Error al cargar los chats:", error)
            }
        }
        loadChatsData()
    }, [])

    const handleChatClick = (chatId: string) => {
        console.log("Chat seleccionado:", chatId)
        router.push(`/u/${chatId}`);
    }

    if (!mounted) return <div className="w-16" /> 

    return (
        <div className={isOpen ? "w-64 transition-all duration-300" : "w-16 transition-all duration-300"}>
            <button onClick={() => setIsOpen(!isOpen)}>
                {isOpen ? "Cerrar" : "Abrir"}
            </button>
            <button>
                Nuevo Chat
            </button>
            <p>Lista de chats:</p>
            {
                chats.map(chat => (
                    <div 
                        key={chat.id}
                        onClick={() => handleChatClick(chat.id)}
                    >
                        {chat.name}
                    </div>
                ))
            }
        </div>
    )

}
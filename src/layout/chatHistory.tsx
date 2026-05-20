import React, { useEffect, useState } from "react"

export default function ChatHistory({ 
    isOpen,
        setIsOpen 
}: { 
    isOpen: boolean, 
    setIsOpen: (isOpen: boolean) => void 
}) {
    const [mounted, setMounted] = useState(false)
    const [chats, setChats] = useState([])
    
    useEffect(() => {
        setMounted(true)
    }, [])

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
            {/* Maping of the chats here */}
        </div>
    )

}
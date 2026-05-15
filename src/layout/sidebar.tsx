import React, { useEffect, useState } from "react"

export default function Sidebar() {
    const [isOpen, setIsOpen] = useState(false)
    const [chatList, setChatList] = useState([])
    const [mounted, setMounted] = useState(false)
    
    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return <div className="w-16" /> 

    return (
        <div className={isOpen ? "w-64" : "w-16"}>
            <button onClick={() => setIsOpen(!isOpen)}>
                {isOpen ? "Cerrar" : "Abrir"}
            </button>
            <button>
                Nuevo Chat
            </button>
            <p>Lista de chats:</p>
            {/* Aquí irá tu mapeo de workspaces luego */}
        </div>
    )

}
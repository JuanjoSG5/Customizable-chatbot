import React, { useState } from "react"

export default function Sidebar() {
    const [isOpen, setIsOpen] = useState(true)
    const [chatList, setChatList] = useState([])

    return (
        <div className={isOpen ? "w-64" : "w-16"}>
            <button onClick={() => setIsOpen(!isOpen)}>
                {isOpen ? "Cerrar" : "Abrir"}
            </button>
            <p>Lista de chats:</p>
            {/* Aquí irá tu mapeo de workspaces luego */}
        </div>
    )

}
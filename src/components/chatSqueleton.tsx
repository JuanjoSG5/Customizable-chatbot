import { useState } from "react";
import { useRouter } from "next/router";
import { createNewChat } from "../features/chats/create_chat";
import TextBox from "./textBox";

export default function ChatSqueleton() {
    const router = useRouter();
    const [input, setInput] = useState("");
    const [isCreatingChat, setIsCreatingChat] = useState(false);

    const handleCreate = async () => {
        if (!input.trim() || isCreatingChat) return;
        setIsCreatingChat(true);
        try {
            const newId = await createNewChat(input);
            router.push(`/u/${newId}`);
        } catch (error) {
            console.error("Error creating new chat:", error);
        } finally {
            setIsCreatingChat(false);
        }
    };

    return (
        <div className="flex flex-col h-full w-full bg-white dark:bg-slate-900">
            { /* Skeleton Header*/}
            <div className="flex items-center justify-between px-6 py-3 border-b border-slate-100 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50">
                <h2 className="text-base font-semibold text-slate-800 dark:text-slate-200">
                    New Chat
                </h2>
            </div>
            <div className="w-full bg-gradient-to-t from-white via-white to-transparent dark:from-slate-900 pt-6 pb-6 px-4">
                <div className="max-w-3xl mx-auto w-full relative">
                    <TextBox
                        input={input}
                        setInput={setInput}
                        handleSend={handleCreate}
                        isSetupComplete={true} 
                        loading={isCreatingChat}
                    />
                </div>
            </div>
        </div>
    )

}
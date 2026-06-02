import Layout from "@/src/layout/layout";
import { useRouter } from "next/router";
import { useState } from "react";
import { createNewChat } from "../features/chats/create_chat";
import ChatSqueleton from "../components/chatSqueleton";

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    setLoading(true);
    try {
      const newId = await createNewChat();
      router.push(`/u/${newId}`);
    } catch (error) {
      console.error("Error creating new chat:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Layout chatId="null">
      <ChatSqueleton />
    </Layout>
  );
}
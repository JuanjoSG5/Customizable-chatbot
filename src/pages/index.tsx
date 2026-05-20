import Layout from "@/src/layout/layout";
import Link from "next/link";
import { supabase } from "@/src/utils/supabase";
import { useRouter } from "next/router";
import { useState } from "react";
import ScraperForm from "../components/scrapForm";
import { createNewChat } from "../features/chats/create_chat";

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
    <Layout>
      <div className="flex flex-col items-center justify-center h-screen space-y-4">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
          Welcome to AI Knowledge Base
        </h1>
        <button
          onClick={handleCreate}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          {loading ? "Creating..." : "Create New Chat"}
        </button>
      </div>
    </Layout>
  );
}
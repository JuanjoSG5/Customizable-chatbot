import { useRouter } from "next/router";
import Chat from "@/src/components/chat";
import ScraperForm from "@/src/components/scrapForm";
import Layout from "@/src/layout/layout";
import Chatbot from "@/src/components/chatbot";

export default function ChatPage() {
    const router = useRouter();
    const { chatId } = router.query;
    // Forzamos que sea un string para los componentes hijos
    const id = Array.isArray(chatId) ? chatId[0] : chatId;

    if (!id) {
        return (
            <Layout>
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
                    Data Ingestion
                </h2>
                <p className="text-slate-600 dark:text-slate-400 mt-2">
                    Train your assistant by providing a website to scrape and index.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                <div className="w-full">
                    <ScraperForm/>
                </div>
                <div className="w-full">
                     <Chatbot chatId={chatId} /> 
                </div>
            </div>
        </Layout>
    );
}
import { useRouter } from "next/router";
import Layout from "@/src/layout/layout";
import Chatbot from "@/src/components/chatbot";

export default function ChatPage() {
    const router = useRouter();
    const { chatId } = router.query;
    const id = Array.isArray(chatId) ? chatId[0] : chatId;

    if (!id) {
        return (
            <Layout>
                <div className="flex justify-center items-center h-full w-full ">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <Chatbot chatId={id} /> 
        </Layout>
    );
}
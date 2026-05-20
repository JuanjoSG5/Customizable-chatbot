import { supabase } from "@/src/utils/supabase";

export const scrapeUrl = async (url: string, depth: number, chatId: string) => {
    const res = await fetch("/api/scrape_post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, depth, chatId }),
    });

    if (!res.ok) {
        throw new Error("Error en la petición HTTP al servidor", { cause: await res.text() });
    }

    if (!res.body) {
        throw new Error("Response body is empty");
    }

    return res;
};
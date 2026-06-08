import { NextApiRequest, NextApiResponse } from "next";
import { pipeline } from "@huggingface/transformers";
import { supabase } from "@/src/utils/supabase";
import { ChatOpenAI } from '@langchain/openai';
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";


const HISTORY_LIMIT = 6; 
const SUPABASE_MATCH_COUNT = 3; // Selects the n more relevant chunks from the database


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { question, chatId, modelName } = req.body;
  if (!question || !chatId) return res.status(400).json({ error: 'Question and chatId are required' });

  try {
    // 1. Recover the previous chat memory
    const { data: historyData } = await supabase
      .from('messages')
      .select('role, content')
      .eq('chat_id', chatId)
      .order('created_at', { ascending: false })
      .limit(HISTORY_LIMIT);

    // Sort the data
    const sortedHistory = historyData
      // The last .join is done so that the sortedHistory is a string rather than a []
      ? historyData.reverse().map(message => `${message.role.toUpperCase()}: ${message.content}`).join("\n")
      : "No previous history.";

    // Create the vectorization of the question 
    const extractor = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
    const output = await extractor(question, { pooling: "mean", normalize: true });
    const queryEmbedding = Array.from(output.data);

    // Search most relevant chunks
    const { data: documents, error: searchError } = await supabase.rpc('match_documents', {
      query_embedding: queryEmbedding,
      match_count: SUPABASE_MATCH_COUNT,
      p_chat_id: chatId
    });

    if (searchError) throw searchError;

    const contextText = documents && documents.length > 0 
        ? documents.map((doc: any) => doc.content || doc.text).join("\n\n") 
        : "";

    let promptTemplate;

    if (contextText.trim() === "") {
      promptTemplate = PromptTemplate.fromTemplate(`
        Eres un asistente de IA conversacional muy útil y amigable. 
        El usuario acaba de crear este espacio de trabajo y aún no ha subido ningún documento de contexto.
        Responde a la PREGUNTA del usuario usando tu conocimiento general y mantén una conversación natural basada en el HISTORIAL.
        
        HISTORIAL DE CONVERSACIÓN:
        {history}
        
        PREGUNTA: {question} 
        RESPUESTA:
      `);
    } else {
      promptTemplate = PromptTemplate.fromTemplate(`
        Eres un asistente de IA especializado en extraer información. 
        Usa los siguientes fragmentos de CONTEXTO recuperado y el HISTORIAL DE CONVERSACIÓN para responder a la PREGUNTA. 
        Si la respuesta no se encuentra en el CONTEXTO, simplemente di que no tienes esa información basada en las fuentes proporcionadas, no inventes nada.
        Mantén la respuesta concisa y clara.
        
        HISTORIAL DE CONVERSACIÓN:
        {history}

        CONTEXTO: 
        {context} 
        
        PREGUNTA: {question} 
        RESPUESTA:
      `);
    }

    const apiKey = process.env.NEXT_OPENROUTER_TOKEN;
    if (!apiKey) {
      throw new Error("🚨 ERROR: NEXT_OPENROUTER_TOKEN is not defined on .env file");
    }

    
    const model = new ChatOpenAI({
      // Added the option to choose the model from the frontend, but you can hardcode it here if you want
      modelName: modelName || process.env.NEXT_OPENROUTER_MODEL_NAME,
      apiKey: apiKey,
      // If you are going to use paid models you can uncomment the line below to set a token limit,
      // since I am using a free model for testing I will leave this here
      // maxTokens: 500,
      streaming: true,
      configuration: { 
        baseURL: "https://openrouter.ai/api/v1",
        defaultHeaders: {
          "HTTP-Referer": "http://localhost:3000",
          "X-Title": "ChatbotApp"
        }
      },
    });

    const chain = promptTemplate.pipe(model).pipe(new StringOutputParser());

    // Headers needed to keep the stream alive
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('Connection', 'keep-alive');

    let streamedResponse = ""; 

    try {
      // We send the message to the LLM
      const stream = await chain.stream({
        question: question,
        context: contextText,
        history: sortedHistory
      });

      for await (const chunk of stream ) {
        streamedResponse += chunk; 

        res.write(`data: ${JSON.stringify({ text: chunk })}\n\n`)

        // Here I force node to send the stream whenever it changes
        if ((res as any).flush) {
          (res as any).flush();
        }
      }
      await supabase.from('messages').insert([
        { role: 'user', content: question, chat_id: chatId },
        { role: 'assistant', content: streamedResponse, chat_id: chatId }
      ]);

      res.end();
    } catch (streamError: any) {
      console.error("Stream error:", streamError);
      res.write(`data: ${JSON.stringify({ error: "Error generando la respuesta" })}\n\n`);
      res.end();
    }
  } catch (error: any) {
    console.error("Error in chat API:", error);
     if (!res.headersSent) {
      res.status(500).json({ error: error.message });
    } else {
      res.end();
    }
  }
}
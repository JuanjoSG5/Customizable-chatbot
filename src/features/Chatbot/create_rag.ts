import { MarkdownTextSplitter } from 'langchain/text_splitter';
import { OpenAIEmbeddings } from '@langchain/openai';
import { Chroma } from "@langchain/community/vectorstores/chroma";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { OpenAI } from '@langchain/openai';
import { PromptTemplate } from "@langchain/core/prompts";

export async function setupRag(markdown: string) {
  if (!markdown) {
    throw new Error("Markdown content is required");
  }

  try {
    // Split the markdown into chunks
    const splitter = new MarkdownTextSplitter({ 
      chunkSize: 1000, 
      chunkOverlap: 200 
    });
    
    const docs = await splitter.splitDocuments([
      { pageContent: markdown, metadata: {} }
    ]);

    // Create vector store
    const vectorStore = await Chroma.fromDocuments(
      docs,
      new OpenAIEmbeddings(),
      { collectionName: "demo-collection" }
    );

    const promptTemplate = PromptTemplate.fromTemplate(`
      You are an assistant for question-answering tasks. Use the following pieces of retrieved context to answer the question. If you don't know the answer, just say that you don't know. Use three sentences maximum and keep the answer concise.
      Question: {question} 
      Context: {context} 
      Answer:
    `);

    // Create QA chain
    const model = new OpenAI({
      modelName: "google/gemini-flash-1.5",
      openAIApiKey: process.env.OPENROUTER_API_KEY,
      configuration: {
        baseURL: "https://openrouter.ai/api/v1",
      },
    });
    
    const chain = await createStuffDocumentsChain({
      llm: model,
      prompt: promptTemplate, 
      outputParser: new StringOutputParser(),
    });

    return {
      chain: chain,
      model: model
    };
  } catch (error) {
    console.error("Error setting up RAG:", error);
    throw error;
  }
}
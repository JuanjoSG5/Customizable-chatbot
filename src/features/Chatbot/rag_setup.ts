
import { MarkdownTextSplitter } from 'langchain/text_splitter';
import { OpenAIEmbeddings } from '@langchain/openai';
import { Chroma } from "@langchain/community/vectorstores/chroma";
import { createRetrievalChain } from "langchain/chains/retrieval";
import { OpenAI } from '@langchain/openai';
import { crawlUrl } from '@/src/utils/clawler';

export async function setupRag() {
  // 1. Fetch Markdown (runtime) or read from disk (deployment)
    

    const docs = new MarkdownTextSplitter({ chunkSize: 1000, chunkOverlap: 200 })
    .splitDocuments([{ pageContent: markdown, metadata: {} }]);

    // 3. Embed & store
    const vectorStore = await Chroma.fromDocuments(
        await docs,
        new OpenAIEmbeddings(),
        { collectionName: "demo-collection" }
      );
    // 4. Create QA chain
    // 4. Create QA chain
    const model = new OpenAI({ temperature: 0 });
    const combineDocsChain = await createStuffDocumentsChain({
      llm: model,
      prompt: `Answer the question based only on the following context:
      {context}
      
      Question: {input}`
    });
    
    return createRetrievalChain({
      combineDocsChain,
      retriever: vectorStore.asRetriever(),
    });
}


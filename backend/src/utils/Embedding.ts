
import OpenAI from "openai";
import { PdfChunk } from "./Chunk";
const client = new OpenAI();

export interface EmbeddingResult {
    embedding: number[];
    chunkIndex: number;
    page: number;
    content: string;
}


export async function ChunksToEmbeddings(chunks: PdfChunk[]) {

    const texts = chunks.map(chunk => chunk.content);

    if (texts.length === 0) {
        throw new Error("No text available for embedding");
    }

    console.log("size of chunks being sent to openAI", texts.length)

    const response = await client.embeddings.create({
        model: "text-embedding-3-small",
        input: texts,
        encoding_format: "float",
        dimensions: 512
    });

    return response.data.map((embeddingObj, i) => ({
        embedding: embeddingObj.embedding,
        chunkIndex: chunks[i].chunkIndex,
        page: chunks[i].page,
        content: chunks[i].content
    }));

}
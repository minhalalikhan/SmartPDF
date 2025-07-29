import { Pinecone } from '@pinecone-database/pinecone'


import { EmbeddingResult } from './Embedding';

const PINECONE_API_KEY = process.env.PINECONE_API_KEY!;

console.log(PINECONE_API_KEY)

const PINECONE_INDEX = process.env.PINECONE_INDEX!; // SmartPDF index name

const PINECONE_HOST = process.env.PINECONE_HOST


const pinecone = new Pinecone({
    apiKey: PINECONE_API_KEY,

});



export async function saveEmbeddingsToPinecone(userID: string, embeddings: EmbeddingResult[]) {

    console.log(PINECONE_API_KEY)

    const list = await pinecone.listIndexes()

    console.log("list of indexes :", list)



    const index = pinecone.Index(PINECONE_INDEX, PINECONE_HOST);

    const vectors = embeddings.map((result) => ({
        id: `chunk-${result.chunkIndex}`,
        values: result.embedding,
        metadata: {
            page: result.page,
            chunkIndex: result.chunkIndex,
            content: result.content,
        },
    }));


    try {
        const batchSize = 100;
        for (let i = 0; i < vectors.length; i += batchSize) {
            const batch = vectors.slice(i, i + batchSize);

            await index.namespace(userID).upsert(batch)
        }

    }
    catch (e) {
        console.error("Error saving embeddings to Pinecone:", e);
        throw new Error("Failed to save embeddings to Pinecone");
    }



}


export async function QueryPinecone(userID: string, queryEmbedding: number[], topK: number = 5) {
    const index = pinecone.Index(PINECONE_INDEX, PINECONE_HOST);

    try {

        const queryResponse = await index.namespace(userID).query({
            vector: queryEmbedding,
            topK: topK,
            includeValues: false,
            includeMetadata: true,
        });


        return queryResponse

    } catch (error) {
        console.error("Error querying Pinecone:", error);
        throw new Error("Failed to query Pinecone");
    }
}


export async function DeleteNamespce(userID: string) {

    console.log("Deleting namespace for user:", userID);


    try {

        const index = pinecone.Index(PINECONE_INDEX, PINECONE_HOST);


        await index.deleteNamespace(userID)

        return true

    } catch (error) {
        throw new Error("Error in Deleting Namespace");
    }

}

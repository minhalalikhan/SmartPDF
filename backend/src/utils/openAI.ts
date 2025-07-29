import axios from 'axios'



export async function GenerateEmbeddingForQuestion(question: string) {


    const embeddingResponse: any = await axios.post(
        'https://api.openai.com/v1/embeddings',
        {
            input: question,
            model: 'text-embedding-3-small',
            dimensions: 512,
        },
        {
            headers: {
                Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
            },
        }
    );



    console.log("Embedding dimension:", embeddingResponse.data.data[0].embedding.length);
    return embeddingResponse.data.data[0].embedding;

}
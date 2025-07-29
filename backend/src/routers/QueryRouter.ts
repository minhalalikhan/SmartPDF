import Express from "express";
import { GenerateEmbeddingForQuestion } from "../utils/openAI";
import { QueryPinecone } from "../utils/PineCone";
import axios from 'axios'

export const QueryRouter = Express.Router();



QueryRouter.get("/", async (req, res) => {

    try {

        const userId = req.query.userID as string;
        const question = req.query.question as string;

        if (!userId || !question) {
            return res.status(400).json({ error: 'Missing userID or question query param' });
        }

        console.log("generating embedding for question")


        const embeddingResponse = await GenerateEmbeddingForQuestion(question)


        console.log("query pinecone ")

        const queryResponse = await QueryPinecone(userId, embeddingResponse, 5)



        if (!queryResponse.matches || queryResponse.matches.length === 0) {
            return res.json({
                answer: "NO reference found in the pdf", embeddingResponse,
                queryResponse, citations: []
            });
        }


        const matchedChunks: string[] = [];
        const citationsSet = new Set<number>();

        for (const match of queryResponse.matches) {
            if (match.metadata) {
                if (match.metadata.content) matchedChunks.push(match.metadata.content as string);
                if (typeof match.metadata.page === 'number') citationsSet.add(match.metadata.page);
            }
        }


        const context = matchedChunks.join('\n---\n');



        const prompt = `Use the following context extracted from a PDF to answer the question. If the question cannot be answered from the context, respond with "NO reference found in the pdf".\n\nContext:\n${context}\n\nQuestion: ${question}\n\nAnswer:`;


        console.log("send  question to openAI with prompts ")
        const completionResponse: any = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: 'gpt-4',
                messages: [
                    { role: 'system', content: 'You are an assistant that answers questions based on provided PDF content.' },
                    { role: 'user', content: prompt },
                ],
                max_tokens: 500,
                temperature: 0,
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
                },
            }
        );

        console.log("got response from openAI ")
        let answer = completionResponse.data.choices[0].message.content.trim();


        if (/no reference found/i.test(answer)) {
            return res.json({ answer: "NO reference found in the pdf", prompt, citations: [] });
        }


        return res.json({
            answer,
            prompt,
            embeddingResponse,
            queryResponse,
            citations: Array.from(citationsSet).sort((a, b) => a - b), // sorted page numbers
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: (err as Error).message });
    }



}
)






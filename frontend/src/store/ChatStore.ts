import { create } from "zustand";


type Message = {
    id: string;
    content: string;
    sender: "user" | "bot";
    timestamp: Date;
    citations: number[]
}

type ChatStore = {

    messages: Message[];
    askQuestion: (question: string) => Promise<void>;

    thinking: boolean,
    ResponseStatus: 'INIT' | 'PENDING' | 'SUCCESS' | 'ERROR';
    DeleteChat: () => void;

}


export const useChatStore = create<ChatStore>((set, get) => ({

    thinking: false,
    ResponseStatus: 'INIT',
    messages: [],
    askQuestion: async (question: string) => {
        const newMessage: Message = {
            //   id: crypto.randomUUID(),
            id: "",
            content: question,
            sender: "user",
            timestamp: new Date(),
            citations: []
        };

        set((state) => ({
            messages: [...state.messages, newMessage],
            thinking: true,
            ResponseStatus: 'PENDING',
        }));

        // Simulate API call
        try {
            const response = await fetch("http://localhost:4000/api/ask", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ question }),
            });

            if (!response.ok)
                throw new Error("Network response was not ok");



            const data = await response.json();
            const botMessage: Message = {
                id: crypto.randomUUID(),
                content: data.answer,
                sender: "bot",
                timestamp: new Date(),
                citations: data.citations || [],
            };

            set((state) => ({
                messages: [...state.messages, botMessage],
                thinking: false,
                ResponseStatus: 'SUCCESS',
            }));
        } catch (error) {
            console.error("Error asking question:", error);
            set(() => ({
                thinking: false,
                ResponseStatus: 'ERROR',
            }));
        }
    },


    DeleteChat: () => {
        set({
            messages: [],
            thinking: false,
            ResponseStatus: 'INIT',
        });
    },
}))
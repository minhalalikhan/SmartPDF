import { create } from "zustand";
import axios from "axios";
import { useUserStore } from "@/store/UserStore";

const backend_url = import.meta.env.BACKEND_URL

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


export const useChatStore = create<ChatStore>((set) => ({

    thinking: false,
    ResponseStatus: 'INIT',
    messages: [],
    askQuestion: async (question: string) => {
        const newMessage: Message = {

            id: Date.now().toString(),
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

        const userID = useUserStore.getState().userID
        try {
            const response = await axios.get(backend_url + "/api/ask", {

                headers: {
                    "Content-Type": "application/json",
                },
                params: {
                    userID,
                    question
                }

            });



            const data = await response.data;
            const botMessage: Message = {
                id: Date.now().toString(),
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
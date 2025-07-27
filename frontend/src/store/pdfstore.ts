import { create } from "zustand";
import axios, { type AxiosResponse } from "axios";
import { useUserStore } from "@/store/UserStore";

type PDFStore = {
  pdfFile: File | null;
  pdfUrl: string | null;
  uploading: boolean;
  uploadProgress: number;
  uploadSuccess: boolean;
  docID: string | null;
  uploadError: string | null;
  setPDF: (file: File) => void;
  clearPDF: () => void;
};

export const usePDFStore = create<PDFStore>((set) => ({
  pdfFile: null,
  pdfUrl: null,
  docID: null,
  uploading: false,
  uploadProgress: 0,
  uploadSuccess: false,
  uploadError: null,

  setPDF: async (file: File) => {
    const blobUrl = URL.createObjectURL(file);
    set({
      pdfFile: null,
      pdfUrl: null,
      uploading: true,
      uploadProgress: 0,
      uploadSuccess: false,
      uploadError: null,
    });

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await axios.post("http://localhost:4000/api/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
          set({ uploadProgress: progress });
        },
      });

      // Handle success
      set({
        uploading: false,
        pdfFile:file,
          docID: null, // update this if your API returns a docID
        pdfUrl:blobUrl,
        uploadSuccess: true,
        uploadError: null,
      });

      // Optionally: do something with response.data
    } catch (error: any) {
      set({
        uploading: false,
        uploadSuccess: false,
        uploadError: error?.response?.data?.message || "Upload failed",
      });
    }
  },

  clearPDF: () =>{

    const userID=useUserStore.getState().userID
// call api to clear PDF data


      const response =  axios.get("http://localhost:4000/api/clearPDF",  {
        params: { userID },  
      });

    set({
      pdfFile: null,
      pdfUrl: null,
      docID: null,
      uploading: false,
      uploadProgress: 0,
      uploadSuccess: false,
      uploadError: null,
    })
  }
}));


// /////



// import { v4 as uuid } from 'uuid';
// import axios from 'axios';
// import type { AxiosError } from "axios";

// export const useChatStore = create((set, get) => ({
//   // Core state
//   messages: [],
//   docId: null,
//   numPages: 0,
//   activePage: null,

//   // API state
//   loadingUpload: false,
//   loadingAsk: false,
//   error: null,

//   // Upload PDF
//   uploadPdf: async (file:File) => {
//     set({ loadingUpload: true, error: null });
//     try {
//       const formData = new FormData();
//       formData.append('pdf', file);

//       const res = await axios.post('/upload', formData);
//       const { docId, numPages } = res.data;

//       set({ docId, numPages });
//     } catch (err:AxiosError) {
//       set({ error: err.message || 'Upload failed' });
//     } finally {
//       set({ loadingUpload: false });
//     }
//   },

//   // Ask a question
//   askQuestion: async (text:) => {
//     const { docId, messages } = get();
//     if (!docId) return;

//     set({ loadingAsk: true, error: null });

//     // Optimistically add user message
//     const userMsg = { id: uuid(), role: 'user', text };
//     set({ messages: [...messages, userMsg] });

//     try {
//       const res = await axios.post('/ask', { docId, question: text });
//       const botMsg = {
//         id: uuid(),
//         role: 'bot',
//         text: res.data.answer,
//         citations: res.data.citations
//       };

//       set((state) => ({
//         messages: [...state.messages, botMsg]
//       }));
//     } catch (err) {
//       set({ error: err.message || 'Failed to get response' });
//     } finally {
//       set({ loadingAsk: false });
//     }
//   },

//   // Clear session
//   reset: () => set({
//     messages: [],
//     docId: null,
//     numPages: 0,
//     activePage: null,
//     error: null,
//     loadingUpload: false,
//     loadingAsk: false
//   }),

//   // Scroll to citation
//   scrollToPage: (pageNum) => {
//     set({ activePage: pageNum });
//     const el = document.getElementById(`page-${pageNum}`);
//     if (el) el.scrollIntoView({ behavior: 'smooth' });
//   }
// }));

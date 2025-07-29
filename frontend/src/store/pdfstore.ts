import { create } from "zustand";
import axios from "axios";
import { useUserStore } from "@/store/UserStore";



const backend_url = import.meta.env.BACKEND_URL

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
      const UserID = useUserStore.getState().userID;

      if (!UserID) {
        throw new Error("User ID is not set");
      }




      await axios.post(backend_url + "/api/pdf/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        params: {
          userID: UserID,
        },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
          set({ uploadProgress: progress });
        },
      });

      // Handle success
      set({
        uploading: false,
        pdfFile: file,
        docID: null, // update this if your API returns a docID
        pdfUrl: blobUrl,
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

  clearPDF: () => {

    const userID = useUserStore.getState().userID
    // call api to clear PDF data


    axios.get(backend_url + "/api/pdf/clear", {
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



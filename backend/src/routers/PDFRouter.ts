import path from "path";
import fs from "fs";
import multer, { memoryStorage } from "multer";
import express from "express";
import { extractChunksWithPageNumbers } from "../utils/Chunk";
import { ChunksToEmbeddings } from "../utils/Embedding";
import { DeleteNamespce, saveEmbeddingsToPinecone } from "../utils/PineCone";
import { userPDFMap } from "../PDFmap";

export const PDFrouter = express.Router();


const UPLOAD_DIR = process.env.UPLOAD_DIR || path.join(process.cwd(), "uploads");
if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}





const fileFilter = (_req, file, cb) => {
    if (file.mimetype === "application/pdf") cb(null, true);
    else cb(new Error("Only PDF files are allowed"));
};


const upload = multer({
    storage: memoryStorage(),
    fileFilter,
    limits: {
        fileSize: process.env.MAX_FILE_SIZE ? Number(process.env.MAX_FILE_SIZE) : undefined,
        files: 1,
    },
});


PDFrouter.use(express.static(UPLOAD_DIR));


PDFrouter.post("/upload",
    // upload.single("file"),
    async (req, res) => {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        const { filename, originalname, size, mimetype } = req.file;
        const userID = req.query.userID as string;

        const publicUrl = `${process.env.PUBLIC_URL || "http://localhost:4000"}/uploads/${filename}`;


        if (!userID) {
            return res.status(400).json({ message: "User ID is required" });
        }

        if (userPDFMap.has(userID)) {
            // If user already has a PDF, remove the old one

            await DeleteNamespce(userID)
        }



        try {

            console.log("extract chunks")
            //  Create Chunks of pdf
            const chunks = await extractChunksWithPageNumbers(req.file.buffer);


            // create embeddings of each chunk
            console.log("generate embeddings from  chunks")

            const embedding = await ChunksToEmbeddings(chunks)
            //  Save the embeddings to the pinecode database

            console.log("save embeddings to pinecone")
            await saveEmbeddingsToPinecone(userID, embedding);

            userPDFMap.set(userID, originalname)

            return res.status(200).json({
                message: "File processed successfully",
            });
        } catch (err) {
            console.error("Error parsing PDF:", err);
            return res.status(500).json({ message: "Error processing PDF" });
        }



    });


PDFrouter.get("/clear", async (req, res) => {
    const userID = req.query.userID as string;
    if (!userID) {
        return res.status(400).json({ message: "User ID is required" });
    }

    // Logic to clear PDF data for the user

    try {

        if (userPDFMap.has(userID)) {

            await DeleteNamespce(userID)

            userPDFMap.delete(userID)

            return res.status(200).json({
                message: "PDF data cleared successfully",
                userID,
            });

        } else {
            //  no need to delete anything
            return res.status(204).json({
                message: "No User with this ID",

            });
        }

    } catch (e) {

        return res.status(500).json({
            message: "Error in Deleting Namespace",

        });

    }




})


// Centralized error handler
PDFrouter.use((err, _req, res, _next) => {
    console.error(err);
    if (err.message === "Only PDF files are allowed") {
        return res.status(400).json({ message: err.message });
    }
    if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(413).json({ message: "File too large" });
    }
    return res.status(500).json({ message: "Internal server error" });
});



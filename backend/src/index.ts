
import express from "express";
import cors from "cors";


import dotenv from "dotenv";
dotenv.config();

import { router } from "./routers/Router";


const app = express();
app.use(cors());



app.use('/api', router)


app.get("/persist", (req, res) => {
  res.json({ message: "Server is running and ready to persist data." });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`File upload server listening on http://localhost:${PORT}`);

  setInterval(() => {

    fetch("https://smartpdf-a2ym.onrender.com/persist")
  }, 12 * 60 * 1000);
});

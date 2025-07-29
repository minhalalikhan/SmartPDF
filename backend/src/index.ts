
import express from "express";
import cors from "cors";


import dotenv from "dotenv";
dotenv.config();

import { router } from "./routers/Router";


const app = express();
app.use(cors());



app.use('/api', router)


const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`File upload server listening on http://localhost:${PORT}`);
});

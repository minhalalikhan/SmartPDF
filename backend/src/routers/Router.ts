import express from 'express';

import { PDFrouter } from './PDFRouter';
import { QueryRouter } from './QueryRouter';

export const router = express.Router();




router.use('/pdf', PDFrouter);
router.use('/ask', QueryRouter);







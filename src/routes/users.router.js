import express from 'express';
import uploader from '../utils/uploader.js';
import { uploadDocuments } from '../controllers/user.controller.js';

const router = express.Router();

// Este endpoint usa uploader dinámico y luego llama al controlador
router.post('/:uid/documents', uploader.array('documents'), uploadDocuments);

export default router;
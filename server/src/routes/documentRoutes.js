import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import {
  getDocuments,
  getAllDocumentsController,
  createNewDocument,
  getDocument,
  updateDocumentController,
  deleteDocumentController,
  addCollaboratorController,
  joinDocumentController
} from '../controllers/documentController.js';

const router = express.Router();

// all document routes require authentication
router.use(authMiddleware);

// current user's docs (owner or collaborator)
router.get('/', getDocuments);

// 🔹 all documents (everyone sees everything in the list)
router.get('/all', getAllDocumentsController);

// 🔹 join a document as collaborator (current user)
router.post('/:id/join', joinDocumentController);

// create a new document
router.post('/', createNewDocument);

// get / update / delete single document
router.get('/:id', getDocument);
router.put('/:id', updateDocumentController);
router.delete('/:id', deleteDocumentController);

// add collaborator explicitly (owner only)
router.post('/:id/collaborators', addCollaboratorController);

export default router;

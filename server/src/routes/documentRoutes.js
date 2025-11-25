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
  joinDocumentController,
  generateShareLinkController,
  accessSharedDocumentController
} from '../controllers/documentController.js';

const router = express.Router();

/*  
|--------------------------------------------------------------------------
|   PUBLICLY ACCESSIBLE SHARE LINK (REQUIRES LOGIN BUT NOT OWNER)
|--------------------------------------------------------------------------
|  IMPORTANT: This MUST be above router.use(authMiddleware)
|  Otherwise Express tries to match `/share/:id` as a normal doc id → WRONG
|--------------------------------------------------------------------------
*/

router.get('/share/:shareId', authMiddleware, accessSharedDocumentController);

/*
|--------------------------------------------------------------------------
|   ALL ROUTES BELOW REQUIRE AUTH
|--------------------------------------------------------------------------
*/

router.use(authMiddleware);

// get current user's docs
router.get('/', getDocuments);

// get all docs
router.get('/all', getAllDocumentsController);

// create new doc
router.post('/', createNewDocument);

// join document as collaborator
router.post('/:id/join', joinDocumentController);

// get / update / delete doc
router.get('/:id', getDocument);
router.put('/:id', updateDocumentController);
router.delete('/:id', deleteDocumentController);

// add collaborator
router.post('/:id/collaborators', addCollaboratorController);

// generate share link (owner only)
router.post('/:id/share', generateShareLinkController);

export default router;

import {
  getUserDocuments,
  getAllDocuments,
  createDocument,
  getDocumentById,
  updateDocument,
  deleteDocument,
  addCollaborator,
  joinDocument,
  generateShareLink,
  getDocumentByShareId
} from '../services/documentService.js';

// GET /api/documents  → current user's docs (owner or collaborator)
export const getDocuments = async (req, res, next) => {
  try {
    const docs = await getUserDocuments(req.user._id);
    res.json(docs);
  } catch (error) {
    next(error);
  }
};

// 🔹 GET /api/documents/all → all docs from everyone
export const getAllDocumentsController = async (req, res, next) => {
  try {
    const docs = await getAllDocuments();
    res.json(docs);
  } catch (error) {
    next(error);
  }
};

// POST /api/documents → create a new doc as current user
export const createNewDocument = async (req, res, next) => {
  try {
    const doc = await createDocument({
      title: req.body.title,
      ownerId: req.user._id
    });
    res.status(201).json(doc);
  } catch (error) {
    next(error);
  }
};

// GET /api/documents/:id → get a doc (must be owner or collaborator)
export const getDocument = async (req, res, next) => {
  try {
    const doc = await getDocumentById({
      docId: req.params.id,
      userId: req.user._id
    });
    res.json(doc);
  } catch (error) {
    next(error);
  }
};

// PUT /api/documents/:id → update title/content (owner or collaborator)
export const updateDocumentController = async (req, res, next) => {
  try {
    const doc = await updateDocument({
      docId: req.params.id,
      userId: req.user._id,
      title: req.body.title,
      content: req.body.content
    });
    res.json(doc);
  } catch (error) {
    next(error);
  }
};

// DELETE /api/documents/:id → delete doc (owner only)
export const deleteDocumentController = async (req, res, next) => {
  try {
    const result = await deleteDocument({
      docId: req.params.id,
      userId: req.user._id
    });
    res.json(result);
  } catch (error) {
    next(error);
  }
};

// POST /api/documents/:id/collaborators → owner adds collaborator by id
export const addCollaboratorController = async (req, res, next) => {
  try {
    const doc = await addCollaborator({
      docId: req.params.id,
      ownerId: req.user._id,
      collaboratorId: req.body.collaboratorId
    });
    res.json(doc);
  } catch (error) {
    next(error);
  }
};

// 🔹 POST /api/documents/:id/join → current user joins doc as collaborator
export const joinDocumentController = async (req, res, next) => {
  try {
    const doc = await joinDocument({
      docId: req.params.id,
      userId: req.user._id
    });
    res.json(doc);
  } catch (error) {
    next(error);
  }
};

// POST /api/documents/:id/share → generate a public shareable link
export const generateShareLinkController = async (req, res, next) => {
  try {
    const result = await generateShareLink({
      docId: req.params.id,
      userId: req.user._id
    });

    res.json(result);
  } catch (error) {
    next(error);
  }
};

// GET /api/documents/share/:shareId → open document via share link
export const accessSharedDocumentController = async (req, res, next) => {
  try {
    const doc = await getDocumentByShareId({
      shareId: req.params.shareId,
      userId: req.user._id
    });

    res.json(doc);
  } catch (error) {
    next(error);
  }
};



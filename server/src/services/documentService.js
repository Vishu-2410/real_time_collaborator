// src/services/documentService.js
import Document from '../models/Document.js';
import { ApiError } from '../utils/apiError.js';

/**
 * Docs where the user is owner or collaborator
 */
export const getUserDocuments = async (userId) => {
  const docs = await Document.find({
    $or: [{ ownerId: userId }, { collaborators: userId }]
  })
    .sort({ updatedAt: -1 });

  return docs;
};

/**
 * 🔹 NEW: all documents (visible to every logged-in user)
 */
export const getAllDocuments = async () => {
  const docs = await Document.find({})
    .populate('ownerId', 'username email')
    .sort({ updatedAt: -1 });

  return docs;
};

/**
 * Create a new document with the given owner
 */
export const createDocument = async ({ title, ownerId }) => {
  const doc = await Document.create({
    title: title || 'Untitled Document',
    ownerId
  });
  return doc;
};

/**
 * Get a document by id – requires user to be owner or collaborator
 */
export const getDocumentById = async ({ docId, userId }) => {
  const doc = await Document.findById(docId);

  if (!doc) {
    throw new ApiError(404, 'Document not found');
  }

  const canAccess =
    doc.ownerId.equals(userId) || doc.collaborators.some((c) => c.equals(userId));

  if (!canAccess) {
    throw new ApiError(403, 'Forbidden');
  }

  return doc;
};

/**
 * Update document title/content – requires owner or collaborator
 */
export const updateDocument = async ({ docId, userId, title, content }) => {
  const doc = await Document.findById(docId);

  if (!doc) {
    throw new ApiError(404, 'Document not found');
  }

  const canAccess =
    doc.ownerId.equals(userId) || doc.collaborators.some((c) => c.equals(userId));

  if (!canAccess) {
    throw new ApiError(403, 'Forbidden');
  }

  if (title !== undefined) doc.title = title;
  if (content !== undefined) doc.content = content;
  doc.lastUpdated = new Date();

  await doc.save();
  return doc;
};

/**
 * Delete document – only owner can delete
 */
export const deleteDocument = async ({ docId, userId }) => {
  const doc = await Document.findById(docId);

  if (!doc) {
    throw new ApiError(404, 'Document not found');
  }

  if (!doc.ownerId.equals(userId)) {
    throw new ApiError(403, 'Only owner can delete this document');
  }

  await doc.deleteOne();
  return { message: 'Document deleted' };
};

/**
 * Add collaborator – only owner can add explicitly by id
 */
export const addCollaborator = async ({ docId, ownerId, collaboratorId }) => {
  const doc = await Document.findById(docId);

  if (!doc) {
    throw new ApiError(404, 'Document not found');
  }

  if (!doc.ownerId.equals(ownerId)) {
    throw new ApiError(403, 'Only owner can add collaborators');
  }

  if (!doc.collaborators.includes(collaboratorId)) {
    doc.collaborators.push(collaboratorId);
    await doc.save();
  }

  return doc;
};

/**
 * 🔹 NEW: current user joins a document as collaborator
 * - Anyone logged in can "join"
 * - If already owner or collaborator, just returns doc
 */
export const joinDocument = async ({ docId, userId }) => {
  const doc = await Document.findById(docId);

  if (!doc) {
    throw new ApiError(404, 'Document not found');
  }

  const alreadyParticipant =
    doc.ownerId.equals(userId) || doc.collaborators.some((c) => c.equals(userId));

  if (!alreadyParticipant) {
    doc.collaborators.push(userId);
    await doc.save();
  }

  return doc;
};

import crypto from 'crypto';

/**
 * Generate a public share link (like Google Docs)
 * Only owner can enable link sharing.
 */
export const generateShareLink = async ({ docId, userId }) => {
  const doc = await Document.findById(docId);

  if (!doc) {
    throw new ApiError(404, 'Document not found');
  }

  if (!doc.ownerId.equals(userId)) {
    throw new ApiError(403, 'Only owner can create share link');
  }

  // If no share ID exists, generate a new one
  if (!doc.shareId) {
    doc.shareId = crypto.randomBytes(16).toString('hex');
  }

  doc.isPublic = true;
  await doc.save();

  return {
    message: 'Share link created',
    shareUrl: `${process.env.FRONTEND_URL}/document/share/${doc.shareId}`
  };
};

/**
 * Anyone with share link can join document (if isPublic=true)
 */
export const getDocumentByShareId = async ({ shareId, userId }) => {
  const doc = await Document.findOne({ shareId });

  if (!doc) {
    throw new ApiError(404, 'Invalid share link');
  }

  if (!doc.isPublic) {
    throw new ApiError(403, 'This document is not public');
  }

  // If not participant, add automatically
  const isParticipant =
    doc.ownerId.equals(userId) ||
    doc.collaborators.some(c => c.equals(userId));

  if (!isParticipant) {
    doc.collaborators.push(userId);
    await doc.save();
  }

  return doc;
};


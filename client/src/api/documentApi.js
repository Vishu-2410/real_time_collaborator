import client from './client.js';

export const documentApi = {
  list: () => client.get('/documents'),                 // user docs
  all: () => client.get('/documents/all'),             // 🔹 all docs
  create: (payload) => client.post('/documents', payload),
  get: (id) => client.get(`/documents/${id}`),
  update: (id, payload) => client.put(`/documents/${id}`, payload),
  remove: (id) => client.delete(`/documents/${id}`),

  join: (id) => client.post(`/documents/${id}/join`),  // 🔹 join a doc

  // ⭐ NEW — Generate a shareable link (Google Docs style)
  generateShareLink: (id) => client.post(`/documents/${id}/share`),

  // ⭐ NEW — Validate token when user opens shared link URL
  validateShareLink: (token) => client.get(`/documents/shared/${token}`),

  // ⭐ NEW — Get document content using share token
  getSharedDocument: (token) => client.get(`/documents/shared/open/${token}`)
};

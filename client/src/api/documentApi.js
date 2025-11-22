import client from './client.js';

export const documentApi = {
  list: () => client.get('/documents'),          // user docs
  all: () => client.get('/documents/all'),       // 🔹 all docs
  create: (payload) => client.post('/documents', payload),
  get: (id) => client.get(`/documents/${id}`),
  update: (id, payload) => client.put(`/documents/${id}`, payload),
  remove: (id) => client.delete(`/documents/${id}`),

  join: (id) => client.post(`/documents/${id}/join`) // 🔹 join a doc
};

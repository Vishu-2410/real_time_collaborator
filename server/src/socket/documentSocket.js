import Document from '../models/Document.js';

const documentRooms = new Map(); // docId -> Map(socketId -> { userId, username })

export const registerDocumentSocketHandlers = (io) => {
  io.on('connection', (socket) => {
    console.log('Socket connected:', socket.id);

    socket.on('join-document', async ({ documentId, userId, username }) => {
      if (!documentId) return;

      socket.join(documentId);
      socket.data.documentId = documentId;
      socket.data.user = { userId, username };

      if (!documentRooms.has(documentId)) {
        documentRooms.set(documentId, new Map());
      }
      const roomUsers = documentRooms.get(documentId);
      roomUsers.set(socket.id, { userId, username });

      // Notify others & send current list
      socket.to(documentId).emit('user-joined', { userId, username });

      const collaborators = Array.from(roomUsers.values());
      io.to(documentId).emit('collaborators-update', collaborators);

      // Load doc content for this user
      try {
        const doc = await Document.findById(documentId);
        if (doc) {
          socket.emit('load-document', { content: doc.content, title: doc.title });
        }
      } catch (err) {
        console.error('Load doc via socket error:', err.message);
      }
    });

    socket.on('send-changes', ({ documentId, content }) => {
      if (!documentId) return;
      socket.broadcast.to(documentId).emit('receive-changes', content);
    });

    socket.on('save-document', async ({ documentId, content }) => {
      try {
        const doc = await Document.findById(documentId);
        if (doc) {
          doc.content = content;
          doc.lastUpdated = new Date();
          await doc.save();
        }
      } catch (err) {
        console.error('Save doc socket error:', err.message);
      }
    });

    socket.on('disconnect', () => {
      const { documentId, user } = socket.data || {};
      if (documentId && documentRooms.has(documentId)) {
        const roomUsers = documentRooms.get(documentId);
        roomUsers.delete(socket.id);

        if (roomUsers.size === 0) {
          documentRooms.delete(documentId);
        } else {
          const collaborators = Array.from(roomUsers.values());
          socket.to(documentId).emit('user-left', user);
          socket.to(documentId).emit('collaborators-update', collaborators);
        }
      }

      console.log('Socket disconnected:', socket.id);
    });
  });
};

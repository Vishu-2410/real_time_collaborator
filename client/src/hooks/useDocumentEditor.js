import { useEffect, useRef, useState } from 'react';
import { getSocket } from '../socket/socketClient.js';
import { documentApi } from '../api/documentApi.js';
import { useAuth } from './useAuth.js';

export const useDocumentEditor = (documentId, shareId) => {
  const { user } = useAuth();
  const [realDocId, setRealDocId] = useState(documentId); // actual MongoDB _id
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [collaborators, setCollaborators] = useState([]);
  const [status, setStatus] = useState('Connecting...');
  const [loading, setLoading] = useState(true);

  const socketRef = useRef(null);
  const saveIntervalRef = useRef(null);

  // 🔹 1) Load initial document (normal or shared)
  useEffect(() => {
    const load = async () => {
      try {
        let res;

        if (shareId) {
          // 🔥 open using shared link
          res = await documentApi.getShared(shareId);
        } else {
          // normal
          res = await documentApi.get(documentId);
        }

        const doc = res.data;
        setTitle(doc.title);
        setContent(doc.content);
        setRealDocId(doc._id); // real Mongo ID for sockets & autosave

      } catch (err) {
        console.error('Error loading document:', err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [documentId, shareId]);

  // 🔹 2) Socket lifecycle (join actual doc)
  useEffect(() => {
    if (!realDocId) return;

    const socket = getSocket();
    socketRef.current = socket;

    socket.connect();

    socket.emit('join-document', {
      documentId: realDocId,
      userId: user.id,
      username: user.username
    });

    socket.on('connect', () => setStatus('Connected'));
    socket.on('disconnect', () => setStatus('Disconnected'));

    socket.on('load-document', ({ title, content }) => {
      setTitle(title);
      setContent(content);
    });

    socket.on('receive-changes', (newContent) => {
      setContent(newContent);
    });

    socket.on('collaborators-update', (list) => {
      setCollaborators(list);
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('load-document');
      socket.off('receive-changes');
      socket.off('collaborators-update');
      socket.disconnect();
    };
  }, [realDocId, user.id, user.username]);

  // 🔹 3) Auto-save (REST update on real doc)
  useEffect(() => {
    if (!realDocId) return;

    const save = async () => {
      try {
        await documentApi.update(realDocId, { title, content });
        console.log('Auto-saved');
      } catch (err) {
        console.error('Auto-save error:', err);
      }
    };

    saveIntervalRef.current = setInterval(save, 10000);

    return () => clearInterval(saveIntervalRef.current);
  }, [realDocId, title, content]);

  // 🔹 4) On typing update content through socket
  const updateContent = (value) => {
    setContent(value);

    const socket = socketRef.current;
    if (!socket) return;

    socket.emit('send-changes', {
      documentId: realDocId,
      content: value
    });
  };

  // 🔹 5) Save title once on blur
  const updateTitleOnce = async () => {
    try {
      await documentApi.update(realDocId, { title });
    } catch (err) {
      console.error('Title update error:', err);
    }
  };

  return {
    title,
    setTitle,
    content,
    updateContent,
    updateTitleOnce,
    collaborators,
    status,
    loading
  };
};

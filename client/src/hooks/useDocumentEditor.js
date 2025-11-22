import { useEffect, useRef, useState } from 'react';
import { getSocket } from '../socket/socketClient.js';
import { documentApi } from '../api/documentApi.js';
import { useAuth } from './useAuth.js';

export const useDocumentEditor = (documentId) => {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [collaborators, setCollaborators] = useState([]);
  const [status, setStatus] = useState('Connecting...');
  const [loading, setLoading] = useState(true);
  const socketRef = useRef(null);
  const saveIntervalRef = useRef(null);

  // Initial load via REST
  useEffect(() => {
    const load = async () => {
      try {
        const res = await documentApi.get(documentId);
        setTitle(res.data.title);
        setContent(res.data.content);
      } catch (err) {
        console.error('Error loading document:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [documentId]);

  // Socket lifecycle
  useEffect(() => {
    const socket = getSocket();
    socketRef.current = socket;

    socket.connect();

    socket.emit('join-document', {
      documentId,
      userId: user.id,
      username: user.username
    });

    socket.on('connect', () => setStatus('Connected'));
    socket.on('disconnect', () => setStatus('Disconnected'));

    socket.on('load-document', ({ title, content }) => {
      setTitle((prev) => (prev ? prev : title));
      setContent((prev) => (prev ? prev : content));
    });

    socket.on('receive-changes', (newContent) => {
      setContent(newContent);
    });

    socket.on('collaborators-update', (list) => {
      setCollaborators(list);
    });

    socket.on('user-joined', (u) => {
      console.log('User joined:', u);
    });

    socket.on('user-left', (u) => {
      console.log('User left:', u);
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('load-document');
      socket.off('receive-changes');
      socket.off('collaborators-update');
      socket.off('user-joined');
      socket.off('user-left');
      socket.disconnect();
    };
  }, [documentId, user.id, user.username]);

  // Auto-save every 10 seconds via REST
  useEffect(() => {
    const save = async () => {
      try {
        await documentApi.update(documentId, { title, content });
        console.log('Auto-saved');
      } catch (err) {
        console.error('Auto-save error:', err);
      }
    };

    saveIntervalRef.current = setInterval(save, 10000);

    return () => {
      clearInterval(saveIntervalRef.current);
    };
  }, [documentId, title, content]);

  const updateContent = (value) => {
    setContent(value);
    const socket = socketRef.current;
    if (!socket) return;

    socket.emit('send-changes', { documentId, content: value });
  };

  const updateTitleOnce = async () => {
    try {
      await documentApi.update(documentId, { title });
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

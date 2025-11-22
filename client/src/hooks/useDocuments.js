import { useEffect, useState } from 'react';
import { documentApi } from '../api/documentApi';

export const useDocuments = () => {
  const [documents, setDocuments] = useState([]);     // my docs
  const [allDocuments, setAllDocuments] = useState([]); // 🔹 all docs
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const myDocs = await documentApi.list();
      const allDocs = await documentApi.all();

      setDocuments(myDocs.data);
      setAllDocuments(allDocs.data);
    } catch (err) {
      console.error(err);
      setError('Failed to load documents');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const createDocument = async (title) => {
    try {
      const res = await documentApi.create({ title });
      setDocuments((p) => [res.data, ...p]);
      setAllDocuments((p) => [res.data, ...p]);
    } catch (err) {
      setError('Failed to create document');
    }
  };

  const deleteDocument = async (id) => {
    try {
      await documentApi.remove(id);
      setDocuments((p) => p.filter((d) => d._id !== id));
      setAllDocuments((p) => p.filter((d) => d._id !== id));
    } catch {
      setError('Failed to delete document');
    }
  };

  // 🔹 NEW: join another user's doc
  const joinDocument = async (id) => {
    try {
      await documentApi.join(id);
      await fetchDocuments();  // refresh lists
    } catch {
      setError('Failed to join document');
    }
  };

  return {
    documents,
    allDocuments,
    loading,
    error,
    createDocument,
    deleteDocument,
    joinDocument
  };
};

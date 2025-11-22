// src/pages/Dashboard.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDocuments } from '../hooks/useDocuments.js';
import { useAuth } from '../hooks/useAuth.js';
import DocumentList from '../components/documents/DocumentList.jsx';
import AllDocumentsList from '../components/documents/AllDocumentsList.jsx';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';
import ErrorAlert from '../components/common/ErrorAlert.jsx';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    documents,
    allDocuments,
    loading,
    error,
    createDocument,
    deleteDocument,
    joinDocument
  } = useDocuments();

  const [newTitle, setNewTitle] = useState('');

  const handleCreate = async () => {
    const title = newTitle.trim();
    if (!title) return;
    await createDocument(title);
    setNewTitle('');
  };

  const handleOpen = (id) => {
    navigate(`/editor/${id}`);
  };

  const handleJoinAndOpen = async (id) => {
    await joinDocument(id);
    navigate(`/editor/${id}`);
  };

  if (loading && !documents.length && !allDocuments.length) {
    return (
      <div className="max-w-5xl mx-auto mt-6 px-4">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto mt-6 px-4">
      {/* Top bar with create controls */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Your Documents</h1>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="New document title"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="border rounded px-3 py-1 text-sm"
          />
          <button
            onClick={handleCreate}
            className="px-3 py-1 text-sm rounded bg-green-500 text-white"
          >
            Create
          </button>
        </div>
      </div>

      <ErrorAlert message={error} />

      {/* Your docs */}
      <DocumentList
        documents={documents}
        onOpen={handleOpen}
        onDelete={deleteDocument}
      />

      {/* All docs */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-2">All Documents</h2>
        <p className="text-xs text-gray-500 mb-2">
          Join any document to collaborate in real time.
        </p>
        <AllDocumentsList
          documents={allDocuments}
          currentUserId={user.id}
          onOpen={handleOpen}
          onJoin={handleJoinAndOpen}
        />
      </div>
    </div>
  );
};

export default Dashboard;

import { useParams } from 'react-router-dom';
import { useDocumentEditor } from '../hooks/useDocumentEditor.js';
import CollaboratorList from '../components/editor/CollaboratorList.jsx';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';

const Editor = () => {
  const { id } = useParams();
  const {
    title,
    setTitle,
    content,
    updateContent,
    updateTitleOnce,
    collaborators,
    status,
    loading
  } = useDocumentEditor(id);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-5xl mx-auto mt-4 px-4 flex gap-4">
      <div className="flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-3">
          <input
            className="text-xl font-semibold px-2 py-1 border-b w-2/3 bg-transparent outline-none"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={updateTitleOnce}
          />
          <span className="text-xs text-gray-500">{status}</span>
        </div>
        <textarea
          className="flex-1 w-full border rounded p-3 text-sm resize-none bg-white shadow"
          value={content}
          onChange={(e) => updateContent(e.target.value)}
          placeholder="Start typing..."
        />
        <p className="text-xs text-gray-400 mt-2">
          Auto-saving every 10 seconds...
        </p>
      </div>

      <div className="w-64">
        <CollaboratorList collaborators={collaborators} />
      </div>
    </div>
  );
};

export default Editor;

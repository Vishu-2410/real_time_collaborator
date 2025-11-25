import { useParams } from 'react-router-dom';
import { useDocumentEditor } from '../hooks/useDocumentEditor.js';
import CollaboratorList from '../components/editor/CollaboratorList.jsx';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';
import { toast } from "react-hot-toast";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const Editor = () => {
  const { id, shareId } = useParams();

  // Use normal id OR share link id
  const realId = shareId || id;

  const {
    title,
    setTitle,
    content,
    updateContent,
    updateTitleOnce,
    collaborators,
    status,
    loading
  } = useDocumentEditor(realId, shareId);

  if (loading) return <LoadingSpinner />;

  // ⭐ COPY SHARE LINK
  const handleShare = () => {
    const link = `${window.location.origin}/editor/share/${realId}`;
    navigator.clipboard.writeText(link);
    toast.success("Share link copied!");
  };

  return (
    <div className="max-w-5xl mx-auto mt-4 px-4 flex gap-4 h-[calc(100vh-80px)]">
      
      {/* LEFT SIDE: Editor */}
      <div className="flex-1 flex flex-col">
        {/* HEADER: Title + Status + Share */}
        <div className="flex items-center justify-between mb-3">
          <input
            className="text-xl font-semibold px-2 py-1 border-b w-2/3 bg-transparent outline-none"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={updateTitleOnce}
          />
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-500">{status}</span>
            <button
              onClick={handleShare}
              className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition"
            >
              Share
            </button>
          </div>
        </div>

        {/* QUILL EDITOR */}
        <div className="flex-1 border rounded shadow bg-white overflow-hidden">
          <ReactQuill
            theme="snow"
            value={content}
            onChange={updateContent}
            placeholder="Start typing..."
            className="h-[calc(100vh-160px)]"
          />
        </div>

        <p className="text-xs text-gray-400 mt-2">
          Auto-saving every 10 seconds...
        </p>
      </div>

      {/* RIGHT SIDE: Collaborators */}
      <div className="w-64">
        <CollaboratorList collaborators={collaborators} />
      </div>
    </div>
  );
};

export default Editor;

const DocumentList = ({ documents, onOpen, onDelete }) => {
  if (documents.length === 0) {
    return (
      <p className="mt-4 text-sm text-gray-500">
        You don&apos;t have any documents yet.
      </p>
    );
  }

  return (
    <ul className="mt-4 space-y-2">
      {documents.map((doc) => (
        <li
          key={doc._id}
          className="bg-white p-3 rounded shadow flex items-center justify-between"
        >
          <div>
            <p className="font-medium">{doc.title}</p>
            <p className="text-xs text-gray-500">
              Last updated: {new Date(doc.updatedAt).toLocaleString()}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              className="px-3 py-1 text-sm rounded bg-blue-500 text-white"
              onClick={() => onOpen(doc._id)}
            >
              Open
            </button>
            <button
              className="px-3 py-1 text-sm rounded bg-red-500 text-white"
              onClick={() => onDelete(doc._id)}
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default DocumentList;

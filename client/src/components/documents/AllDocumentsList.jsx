const AllDocumentsList = ({ documents, currentUserId, onOpen, onJoin }) => {
  return (
    <ul className="mt-3 space-y-2">
      {documents.map((doc) => {
        const owner = doc.ownerId;
        const ownerId = owner?._id || owner;
        const ownerName = owner?.username || 'Unknown';

        const isInDoc =
          ownerId === currentUserId ||
          (doc.collaborators || []).includes(currentUserId);

        return (
          <li key={doc._id} className="bg-white p-3 rounded shadow flex justify-between">
            <div>
              <p className="font-semibold">{doc.title}</p>
              <p className="text-xs text-gray-500">
                Owner: {ownerName} — {new Date(doc.updatedAt).toLocaleString()}
              </p>
            </div>

            {isInDoc ? (
              <button
                className="px-3 py-1 bg-blue-500 text-white rounded"
                onClick={() => onOpen(doc._id)}
              >
                Open
              </button>
            ) : (
              <button
                className="px-3 py-1 bg-purple-500 text-white rounded"
                onClick={() => onJoin(doc._id)}
              >
                Join
              </button>
            )}
          </li>
        );
      })}
    </ul>
  );
};

export default AllDocumentsList;

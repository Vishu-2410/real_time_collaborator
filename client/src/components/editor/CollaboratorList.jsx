const CollaboratorList = ({ collaborators }) => {
  return (
    <div className="bg-white rounded shadow p-3 text-sm">
      <h3 className="font-semibold mb-2">Collaborators</h3>
      {collaborators.length === 0 ? (
        <p className="text-xs text-gray-500">Only you are here.</p>
      ) : (
        <ul className="space-y-1">
          {collaborators.map((c, idx) => (
            <li key={`${c.userId}-${idx}`}>• {c.username || 'Unknown'}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CollaboratorList;

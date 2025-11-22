const ErrorAlert = ({ message }) => {
  if (!message) return null;
  return (
    <p className="mt-3 text-sm text-red-600 bg-red-50 px-3 py-2 rounded">
      {message}
    </p>
  );
};

export default ErrorAlert;

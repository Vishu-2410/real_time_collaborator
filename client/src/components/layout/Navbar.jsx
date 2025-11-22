import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow px-4 py-3 flex items-center justify-between">
      <Link to="/" className="font-semibold text-xl">
        Realtime Docs
      </Link>
      <div className="flex gap-4 items-center">
        {user && (
          <span className="text-sm text-gray-600">Hello, {user.username}</span>
        )}
        {user ? (
          <button
            className="px-3 py-1 rounded bg-red-500 text-white text-sm"
            onClick={handleLogout}
          >
            Logout
          </button>
        ) : (
          <Link
            to="/login"
            className="px-3 py-1 rounded bg-blue-500 text-white text-sm"
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

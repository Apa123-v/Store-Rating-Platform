import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-sm border-b px-6 py-4 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold text-blue-600">StoreRate</Link>
      
      <div className="flex items-center space-x-6">
        <span className="text-sm text-gray-600">Hello, <b>{user?.name}</b></span>
        <button 
          onClick={handleLogout}
          className="text-sm bg-gray-100 hover:bg-red-50 hover:text-red-600 px-4 py-2 rounded-lg transition"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
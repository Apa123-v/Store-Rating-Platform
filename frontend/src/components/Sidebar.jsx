import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const { user } = useAuth();

  const menuItems = {
    admin: [
      { name: 'Dashboard', path: '/admin/dashboard' },
      { name: 'Manage Users', path: '/admin/users' },
      { name: 'Manage Stores', path: '/admin/stores' },
    ],
    user: [
      { name: 'Browse Stores', path: '/stores' },
      { name: 'Change Password', path: '/update-password' },
    ],
    store_owner: [
      { name: 'My Dashboard', path: '/owner/dashboard' },
      { name: 'Change Password', path: '/owner/update-password' },
    ],
  };

  const currentMenu = menuItems[user?.role] || [];

  return (
    <div className="w-64 bg-gray-900 text-white min-h-screen p-6">
      <h2 className="text-2xl font-bold mb-8 text-blue-400">StoreRate</h2>
      <ul className="space-y-4">
        {currentMenu.map((item) => (
          <li key={item.path}>
            <Link 
              to={item.path} 
              className="block py-2 px-4 rounded hover:bg-gray-800 transition-colors"
            >
              {item.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
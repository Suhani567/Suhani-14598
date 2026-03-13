import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Dashboard = () => {
  const { logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <nav className="bg-white shadow-lg mb-8 rounded-xl p-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Dynamic Forms Dashboard
          </h1>
          <div className="flex space-x-4">
            <Link to="/admin/forms" className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition">Manage Forms</Link>
            <button onClick={logout} className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition">Logout</button>
          </div>
        </div>
      </nav>
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link to="/admin/forms" className="bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">📋 Forms</h3>
            <p className="text-gray-600">Create, edit, manage your forms</p>
          </Link>
<Link to="/admin/analytics" className="bg-gradient-to-br from-green-400 to-blue-500 p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all text-white cursor-pointer">
            <h3 className="text-2xl font-bold mb-4">📊 Analytics</h3>
            <p>View submissions, trends, charts</p>
          </Link>
<Link to="/admin/customize" className="bg-gradient-to-br from-purple-400 to-pink-500 p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all text-white cursor-pointer">
            <h3 className="text-2xl font-bold mb-4">⚙️ Customize</h3>
            <p>Colors, fonts, logo, CSS</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

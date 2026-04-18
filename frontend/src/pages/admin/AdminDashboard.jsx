
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../../api/axios'

const AdminDashboard = () => {
  const navigate = useNavigate()
  const [stats, setStats] = useState({
    totalUsers: 0, totalStores: 0, totalRatings: 0
  })

  useEffect(() => {
    API.get('/users/stats')
      .then(res => setStats(res.data))
      .catch(err => console.error(err))
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow px-8 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-blue-600">Store Rating Platform</h1>
        <div className="flex items-center gap-6">
          <button onClick={() => navigate('/admin/users')}
            className="text-sm text-gray-600 hover:text-blue-600">
            Manage Users
          </button>
          <button onClick={() => navigate('/admin/stores')}
            className="text-sm text-gray-600 hover:text-blue-600">
            Manage Stores
          </button>
          <button onClick={handleLogout}
            className="text-sm bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600">
            Logout
          </button>
        </div>
      </nav>
      <div className="p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Admin Dashboard</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow p-6 border-l-4 border-blue-500">
            <p className="text-sm text-gray-500 mb-1">Total Users</p>
            <p className="text-4xl font-bold text-blue-600">{stats.totalUsers}</p>
          </div>
          <div className="bg-white rounded-xl shadow p-6 border-l-4 border-green-500">
            <p className="text-sm text-gray-500 mb-1">Total Stores</p>
            <p className="text-4xl font-bold text-green-600">{stats.totalStores}</p>
          </div>
          <div className="bg-white rounded-xl shadow p-6 border-l-4 border-yellow-500">
            <p className="text-sm text-gray-500 mb-1">Total Ratings</p>
            <p className="text-4xl font-bold text-yellow-600">{stats.totalRatings}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Quick Actions</h3>
          <div className="flex gap-4">
            <button onClick={() => navigate('/admin/users')}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 text-sm">
              Manage Users
            </button>
            <button onClick={() => navigate('/admin/stores')}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 text-sm">
              Manage Stores
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
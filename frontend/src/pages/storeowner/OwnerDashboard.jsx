import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../../api/axios'

const OwnerDashboard = () => {
  const navigate = useNavigate()
  const [ratings, setRatings] = useState([])
  const [average, setAverage] = useState(null)
  const [sortOrder, setSortOrder] = useState('asc')
  const user = JSON.parse(localStorage.getItem('user'))

  useEffect(() => {
    if (user?.storeId) {
      API.get(`/ratings/store/${user.storeId}`)
        .then(res => {
          setRatings(res.data.ratings)
          setAverage(res.data.average)
        })
        .catch(err => console.error(err))
    }
  }, [])

  const sorted = [...ratings].sort((a, b) => {
    if (sortOrder === 'asc') return a.name > b.name ? 1 : -1
    return a.name < b.name ? 1 : -1
  })

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow px-8 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-blue-600">Store Rating Platform</h1>
        <div className="flex items-center gap-6">
          <button onClick={() => navigate('/owner/update-password')}
            className="text-sm text-gray-600 hover:text-blue-600">Update Password</button>
          <button onClick={() => { localStorage.clear(); navigate('/login') }}
            className="text-sm bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600">Logout</button>
        </div>
      </nav>
      <div className="p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Store Owner Dashboard</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow p-6 border-l-4 border-blue-500">
            <p className="text-sm text-gray-500 mb-1">Store Name</p>
            <p className="text-xl font-bold text-gray-800">{user?.storeName || 'Your Store'}</p>
          </div>
          <div className="bg-white rounded-xl shadow p-6 border-l-4 border-yellow-500">
            <p className="text-sm text-gray-500 mb-1">Average Rating</p>
            <p className="text-4xl font-bold text-yellow-600">
              ⭐ {average || 'No ratings yet'}
            </p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <div className="px-6 py-4 border-b flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-700">Users Who Rated Your Store</h3>
            <button onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="text-sm text-blue-600 hover:underline">
              Sort by Name {sortOrder === 'asc' ? '↑' : '↓'}
            </button>
          </div>
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-6 py-3 text-gray-600 font-semibold">Name</th>
                <th className="text-left px-6 py-3 text-gray-600 font-semibold">Email</th>
                <th className="text-left px-6 py-3 text-gray-600 font-semibold">Rating</th>
                <th className="text-left px-6 py-3 text-gray-600 font-semibold">Date</th>
              </tr>
            </thead>
            <tbody>
              {sorted.length === 0 ? (
                <tr><td colSpan={4} className="text-center py-8 text-gray-400">No ratings yet</td></tr>
              ) : (
                sorted.map((r, i) => (
                  <tr key={i} className="border-b hover:bg-gray-50 transition">
                    <td className="px-6 py-4 text-gray-800">{r.name}</td>
                    <td className="px-6 py-4 text-gray-600">{r.email}</td>
                    <td className="px-6 py-4">
                      <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-xs font-medium">
                        {r.rating} ⭐
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {new Date(r.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default OwnerDashboard
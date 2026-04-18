import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../../api/axios'

const StoreList = () => {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [sortField, setSortField] = useState('name')
  const [sortOrder, setSortOrder] = useState('asc')
  const [stores, setStores] = useState([])
  const [ratingInput, setRatingInput] = useState({})
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  useEffect(() => { fetchStores() }, [])

  const fetchStores = async () => {
    try {
      const res = await API.get('/stores')
      setStores(res.data)
    } catch (err) { console.error(err) }
  }

  const handleSort = (field) => {
    if (sortField === field) setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    else { setSortField(field); setSortOrder('asc') }
  }

  const handleSubmitRating = async (storeId, hasRating) => {
    const rating = ratingInput[storeId]
    if (!rating) return
    try {
      if (hasRating) {
        await API.put('/ratings', { store_id: storeId, rating: parseInt(rating) })
      } else {
        await API.post('/ratings', { store_id: storeId, rating: parseInt(rating) })
      }
      setSuccess('Rating submitted!')
      fetchStores()
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit rating')
      setTimeout(() => setError(''), 3000)
    }
  }

  const filtered = stores
    .filter(s =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.address.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sortOrder === 'asc') return a[sortField] > b[sortField] ? 1 : -1
      return a[sortField] < b[sortField] ? 1 : -1
    })

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow px-8 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-blue-600">Store Rating Platform</h1>
        <div className="flex items-center gap-6">
          <button onClick={() => navigate('/update-password')}
            className="text-sm text-gray-600 hover:text-blue-600">Update Password</button>
          <button onClick={() => { localStorage.clear(); navigate('/login') }}
            className="text-sm bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600">Logout</button>
        </div>
      </nav>
      <div className="p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">All Stores</h2>
        {success && <div className="bg-green-100 text-green-700 px-4 py-2 rounded mb-4 text-sm">{success}</div>}
        {error && <div className="bg-red-100 text-red-600 px-4 py-2 rounded mb-4 text-sm">{error}</div>}
        <div className="bg-white rounded-xl shadow p-4 mb-6">
          <input type="text" placeholder="Search by store name or address..."
            value={search} onChange={e => setSearch(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                {['name', 'address', 'average_rating'].map(field => (
                  <th key={field} onClick={() => handleSort(field)}
                    className="text-left px-6 py-3 text-gray-600 font-semibold cursor-pointer hover:text-blue-600 capitalize">
                    {field === 'average_rating' ? 'Overall Rating' : field} {sortField === field ? (sortOrder === 'asc' ? '↑' : '↓') : '↕'}
                  </th>
                ))}
                <th className="text-left px-6 py-3 text-gray-600 font-semibold">Your Rating</th>
                <th className="text-left px-6 py-3 text-gray-600 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(store => (
                <tr key={store.id} className="border-b hover:bg-gray-50 transition">
                  <td className="px-6 py-4 text-gray-800 font-medium">{store.name}</td>
                  <td className="px-6 py-4 text-gray-600">{store.address}</td>
                  <td className="px-6 py-4">
                    <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-xs font-medium">
                      ⭐ {store.average_rating || 'N/A'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {store.user_rating ? (
                      <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">
                        You rated: {store.user_rating} ⭐
                      </span>
                    ) : (
                      <span className="text-gray-400 text-xs">Not rated yet</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <select
                        value={ratingInput[store.id] || ''}
                        onChange={e => setRatingInput({ ...ratingInput, [store.id]: e.target.value })}
                        className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none">
                        <option value="">Rate</option>
                        {[1, 2, 3, 4, 5].map(n => (
                          <option key={n} value={n}>{n} ⭐</option>
                        ))}
                      </select>
                      <button
                        onClick={() => handleSubmitRating(store.id, !!store.user_rating)}
                        className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-xs">
                        {store.user_rating ? 'Update' : 'Submit'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default StoreList
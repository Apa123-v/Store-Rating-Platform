import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../../api/axios'

const ManageStores = () => {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [sortField, setSortField] = useState('name')
  const [sortOrder, setSortOrder] = useState('asc')
  const [showAddForm, setShowAddForm] = useState(false)
  const [stores, setStores] = useState([])
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [newStore, setNewStore] = useState({
    name: '', email: '', address: ''
  })

  useEffect(() => { fetchStores() }, [])

  const fetchStores = async () => {
    try {
      const res = await API.get('/stores')
      setStores(res.data)
    } catch (err) { console.error(err) }
  }

  const validate = () => {
    if (newStore.name.length < 20 || newStore.name.length > 60)
      return 'Store name must be between 20 and 60 characters'
    if (newStore.address.length > 400)
      return 'Address must be under 400 characters'
    return null
  }

  const handleAddStore = async (e) => {
    e.preventDefault()
    setError('')
    const validationError = validate()
    if (validationError) { setError(validationError); return }
    try {
      await API.post('/stores', newStore)
      setSuccess('Store added successfully!')
      setShowAddForm(false)
      setNewStore({ name: '', email: '', address: '' })
      fetchStores()
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add store')
    }
  }

  const handleSort = (field) => {
    if (sortField === field) setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    else { setSortField(field); setSortOrder('asc') }
  }

  const filtered = stores
    .filter(s =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase()) ||
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
          <button onClick={() => navigate('/admin/dashboard')}
            className="text-sm text-gray-600 hover:text-blue-600">Dashboard</button>
          <button onClick={() => navigate('/admin/users')}
            className="text-sm text-gray-600 hover:text-blue-600">Manage Users</button>
          <button onClick={() => { localStorage.clear(); navigate('/login') }}
            className="text-sm bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600">Logout</button>
        </div>
      </nav>
      <div className="p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Manage Stores</h2>
          <button onClick={() => setShowAddForm(!showAddForm)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 text-sm">
            {showAddForm ? 'Cancel' : '+ Add Store'}
          </button>
        </div>
        {success && <div className="bg-green-100 text-green-700 px-4 py-2 rounded mb-4 text-sm">{success}</div>}
        {showAddForm && (
          <div className="bg-white rounded-xl shadow p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Add New Store</h3>
            {error && <div className="bg-red-100 text-red-600 px-4 py-2 rounded mb-4 text-sm">{error}</div>}
            <form onSubmit={handleAddStore} className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Store Name</label>
                <input type="text" value={newStore.name}
                  onChange={e => setNewStore({ ...newStore, name: e.target.value })}
                  placeholder="Min 20, Max 60 characters"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" required />
                <p className="text-xs text-gray-400 mt-1">{newStore.name.length}/60</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Store Email</label>
                <input type="email" value={newStore.email}
                  onChange={e => setNewStore({ ...newStore, email: e.target.value })}
                  placeholder="Enter store email"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" required />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <textarea value={newStore.address}
                  onChange={e => setNewStore({ ...newStore, address: e.target.value })}
                  placeholder="Enter store address (Max 400 characters)" rows={2}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" required />
              </div>
              <div className="col-span-2">
                <button type="submit"
                  className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 text-sm">
                  Add Store
                </button>
              </div>
            </form>
          </div>
        )}
        <div className="bg-white rounded-xl shadow p-4 mb-6">
          <input type="text" placeholder="Search by name, email, address..."
            value={search} onChange={e => setSearch(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
        </div>
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                {['name', 'email', 'address', 'average_rating'].map(field => (
                  <th key={field} onClick={() => handleSort(field)}
                    className="text-left px-6 py-3 text-gray-600 font-semibold cursor-pointer hover:text-green-600 capitalize">
                    {field === 'average_rating' ? 'Rating' : field} {sortField === field ? (sortOrder === 'asc' ? '↑' : '↓') : '↕'}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={4} className="text-center py-8 text-gray-400">No stores found</td></tr>
              ) : (
                filtered.map(store => (
                  <tr key={store.id} className="border-b hover:bg-gray-50 transition">
                    <td className="px-6 py-4 text-gray-800">{store.name}</td>
                    <td className="px-6 py-4 text-gray-600">{store.email}</td>
                    <td className="px-6 py-4 text-gray-600">{store.address}</td>
                    <td className="px-6 py-4">
                      <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-xs font-medium">
                        ⭐ {store.average_rating || 'No ratings'}
                      </span>
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

export default ManageStores
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../../api/axios'

const ManageUsers = () => {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [sortField, setSortField] = useState('name')
  const [sortOrder, setSortOrder] = useState('asc')
  const [showAddForm, setShowAddForm] = useState(false)
  const [users, setUsers] = useState([])
  const [newUser, setNewUser] = useState({
    name: '', email: '', password: '', address: '', role: 'user'
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const res = await API.get('/users')
      setUsers(res.data)
    } catch (err) {
      console.error(err)
    }
  }

  const validate = () => {
    if (newUser.name.length < 20 || newUser.name.length > 60)
      return 'Name must be between 20 and 60 characters'
    if (newUser.address.length > 400)
      return 'Address must be under 400 characters'
    if (newUser.password.length < 8 || newUser.password.length > 16)
      return 'Password must be 8-16 characters'
    if (!/[A-Z]/.test(newUser.password))
      return 'Password must include at least one uppercase letter'
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(newUser.password))
      return 'Password must include at least one special character'
    return null
  }

  const handleAddUser = async (e) => {
    e.preventDefault()
    setError('')
    const validationError = validate()
    if (validationError) { setError(validationError); return }
    try {
      await API.post('/users', newUser)
      setSuccess('User added successfully!')
      setShowAddForm(false)
      setNewUser({ name: '', email: '', password: '', address: '', role: 'user' })
      fetchUsers()
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add user')
    }
  }

  const handleSort = (field) => {
    if (sortField === field) setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    else { setSortField(field); setSortOrder('asc') }
  }

  const filtered = users
    .filter(u => {
      const matchSearch =
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase()) ||
        u.address.toLowerCase().includes(search.toLowerCase())
      const matchRole = roleFilter ? u.role === roleFilter : true
      return matchSearch && matchRole
    })
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
          <button onClick={() => navigate('/admin/stores')}
            className="text-sm text-gray-600 hover:text-blue-600">Manage Stores</button>
          <button onClick={() => { localStorage.clear(); navigate('/login') }}
            className="text-sm bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600">Logout</button>
        </div>
      </nav>
      <div className="p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Manage Users</h2>
          <button onClick={() => setShowAddForm(!showAddForm)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm">
            {showAddForm ? 'Cancel' : '+ Add User'}
          </button>
        </div>
        {success && <div className="bg-green-100 text-green-700 px-4 py-2 rounded mb-4 text-sm">{success}</div>}
        {showAddForm && (
          <div className="bg-white rounded-xl shadow p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Add New User</h3>
            {error && <div className="bg-red-100 text-red-600 px-4 py-2 rounded mb-4 text-sm">{error}</div>}
            <form onSubmit={handleAddUser} className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input type="text" value={newUser.name}
                  onChange={e => setNewUser({ ...newUser, name: e.target.value })}
                  placeholder="Min 20, Max 60 characters"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                <p className="text-xs text-gray-400 mt-1">{newUser.name.length}/60</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" value={newUser.email}
                  onChange={e => setNewUser({ ...newUser, email: e.target.value })}
                  placeholder="Enter email"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input type="password" value={newUser.password}
                  onChange={e => setNewUser({ ...newUser, password: e.target.value })}
                  placeholder="8-16 chars, 1 uppercase, 1 special"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select value={newUser.role}
                  onChange={e => setNewUser({ ...newUser, role: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="user">Normal User</option>
                  <option value="admin">Admin</option>
                  <option value="store_owner">Store Owner</option>
                </select>
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <textarea value={newUser.address}
                  onChange={e => setNewUser({ ...newUser, address: e.target.value })}
                  placeholder="Enter address (Max 400 characters)" rows={2}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" required />
              </div>
              <div className="col-span-2">
                <button type="submit"
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 text-sm">
                  Add User
                </button>
              </div>
            </form>
          </div>
        )}
        <div className="bg-white rounded-xl shadow p-4 mb-6 flex gap-4">
          <input type="text" placeholder="Search by name, email, address..."
            value={search} onChange={e => setSearch(e.target.value)}
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">All Roles</option>
            <option value="user">Normal User</option>
            <option value="admin">Admin</option>
            <option value="store_owner">Store Owner</option>
          </select>
        </div>
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                {['name', 'email', 'address', 'role'].map(field => (
                  <th key={field} onClick={() => handleSort(field)}
                    className="text-left px-6 py-3 text-gray-600 font-semibold cursor-pointer hover:text-blue-600 capitalize">
                    {field} {sortField === field ? (sortOrder === 'asc' ? '↑' : '↓') : '↕'}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={4} className="text-center py-8 text-gray-400">No users found</td></tr>
              ) : (
                filtered.map(user => (
                  <tr key={user.id} className="border-b hover:bg-gray-50 transition">
                    <td className="px-6 py-4 text-gray-800">{user.name}</td>
                    <td className="px-6 py-4 text-gray-600">{user.email}</td>
                    <td className="px-6 py-4 text-gray-600">{user.address}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        user.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                        user.role === 'store_owner' ? 'bg-green-100 text-green-700' :
                        'bg-blue-100 text-blue-700'}`}>
                        {user.role === 'store_owner' ? 'Store Owner' :
                         user.role === 'admin' ? 'Admin' : 'Normal User'}
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

export default ManageUsers
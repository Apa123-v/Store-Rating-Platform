import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const OwnerUpdatePassword = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    oldPassword: '', newPassword: '', confirmPassword: ''
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const validate = () => {
    if (formData.newPassword.length < 8 || formData.newPassword.length > 16)
      return 'Password must be 8-16 characters'
    if (!/[A-Z]/.test(formData.newPassword))
      return 'Password must include at least one uppercase letter'
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(formData.newPassword))
      return 'Password must include at least one special character'
    if (formData.newPassword !== formData.confirmPassword)
      return 'Passwords do not match'
    return null
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    const validationError = validate()
    if (validationError) {
      setError(validationError)
      return
    }
    setSuccess('Password updated successfully!')
    setFormData({ oldPassword: '', newPassword: '', confirmPassword: '' })
    setTimeout(() => setSuccess(''), 3000)
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow px-8 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-blue-600">Store Rating Platform</h1>
        <div className="flex items-center gap-6">
          <button onClick={() => navigate('/owner/dashboard')}
            className="text-sm text-gray-600 hover:text-blue-600">
            Back to Dashboard
          </button>
          <button onClick={() => navigate('/login')}
            className="text-sm bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600">
            Logout
          </button>
        </div>
      </nav>

      <div className="p-8 flex justify-center">
        <div className="bg-white rounded-xl shadow p-8 w-full max-w-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Update Password</h2>

          {error && (
            <div className="bg-red-100 text-red-600 px-4 py-2 rounded mb-4 text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-100 text-green-600 px-4 py-2 rounded mb-4 text-sm">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Current Password
              </label>
              <input
                type="password"
                value={formData.oldPassword}
                onChange={e => setFormData({ ...formData, oldPassword: e.target.value })}
                placeholder="Enter current password"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                New Password
              </label>
              <input
                type="password"
                value={formData.newPassword}
                onChange={e => setFormData({ ...formData, newPassword: e.target.value })}
                placeholder="8-16 chars, 1 uppercase, 1 special"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm New Password
              </label>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })}
                placeholder="Repeat new password"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition"
            >
              Update Password
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default OwnerUpdatePassword
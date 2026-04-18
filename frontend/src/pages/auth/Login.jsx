import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import API from '../../api/axios'

const Login = () => {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await API.post('/auth/login', formData)
      login(res.data.user, res.data.token)

      // Redirect based on role
      const role = res.data.user.role
      if (role === 'admin') navigate('/admin/dashboard')
      else if (role === 'user') navigate('/stores')
      else if (role === 'store_owner') navigate('/owner/dashboard')

    } catch (err) {
      setError(err.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-neutral-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))] flex items-center justify-center p-4">
  {/* Main Card with Glassmorphism */}
  <div className="bg-white/5 backdrop-blur-lg border border-white/10 p-10 rounded-2xl shadow-2xl w-full max-w-md transition-all duration-300 hover:border-blue-500/30">
    
    {/* Title Section */}
    <div className="text-center mb-8">
      <h2 className="text-3xl font-extrabold tracking-tight text-white mb-2">
        Store Rating <span className="text-blue-500">Platform</span>
      </h2>
      <p className="text-gray-400 font-light">Welcome back! Please enter your details.</p>
    </div>

    {/* Error Message */}
    {error && (
      <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-xl mb-6 text-sm flex items-center animate-pulse">
        <span className="mr-2">⚠️</span> {error}
      </div>
    )}

    {/* Form */}
    <form onSubmit={handleSubmit} className="space-y-6">
      
      {/* Email Field */}
      <div className="group">
        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 group-focus-within:text-blue-400 transition-colors">
          Email Address
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          placeholder="name@company.com"
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
        />
      </div>

      {/* Password Field */}
      <div className="group">
        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 group-focus-within:text-blue-400 transition-colors">
          Password
        </label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
          placeholder="••••••••"
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="relative w-full group overflow-hidden bg-blue-600 text-white py-3 rounded-xl font-bold transition-all duration-300 hover:bg-blue-500 hover:shadow-[0_0_20px_rgba(37,99,235,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span className="relative z-10 flex items-center justify-center">
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Authenticating...
            </>
          ) : 'Login to Dashboard'}
        </span>
      </button>
    </form>

    {/* Register Link */}
    <p className="text-center text-sm text-gray-500 mt-8">
      New to the platform?{' '}
      <Link to="/register" className="text-blue-400 font-semibold hover:text-blue-300 transition-colors underline-offset-4 hover:underline">
        Create an account
      </Link>
    </p>

  </div>
</div>
    
  )
}

export default Login
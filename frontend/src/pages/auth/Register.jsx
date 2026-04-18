import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import API from '../../api/axios'

const Register = () => {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    password: ''
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  // Validate as per project rules
  const validate = () => {
    if (formData.name.length < 20 || formData.name.length > 60) {
      return 'Name must be between 20 and 60 characters'
    }
    if (formData.address.length > 400) {
      return 'Address must be under 400 characters'
    }
    if (formData.password.length < 8 || formData.password.length > 16) {
      return 'Password must be 8-16 characters'
    }
    if (!/[A-Z]/.test(formData.password)) {
      return 'Password must include at least one uppercase letter'
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(formData.password)) {
      return 'Password must include at least one special character'
    }
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    const validationError = validate()
    if (validationError) {
      setError(validationError)
      return
    }

    setLoading(true)
    try {
      await API.post('/auth/register', formData)
      setSuccess('Registration successful! Redirecting to login...')
      setTimeout(() => navigate('/login'), 2000)
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    
    <div className="min-h-screen bg-neutral-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(99,102,241,0.25),rgba(255,255,255,0))] flex items-center justify-center p-6">
  {/* Registration Card */}
  <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl w-full max-w-lg transition-all duration-500 hover:border-indigo-500/30">
    
    {/* Header */}
    <div className="text-center mb-8">
      <h2 className="text-3xl font-bold tracking-tight text-white mb-2">
        Create <span className="text-indigo-400">Account</span>
      </h2>
      <p className="text-gray-400 font-light">Join our community of store reviewers</p>
    </div>

    {/* Status Messages */}
    {error && (
      <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-2 rounded-xl mb-4 text-sm flex items-center">
        <span className="mr-2">✕</span> {error}
      </div>
    )}
    {success && (
      <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-4 py-2 rounded-xl mb-4 text-sm flex items-center">
        <span className="mr-2">✓</span> {success}
      </div>
    )}

    {/* Form */}
    <form onSubmit={handleSubmit} className="space-y-5">
      
      {/* Full Name */}
      <div className="group">
        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1.5 group-focus-within:text-indigo-400 transition-colors">
          Full Name
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          placeholder="Enter your full name"
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
        />
        <div className="flex justify-end mt-1">
          <span className={`text-[10px] font-medium ${formData.name.length > 60 ? 'text-red-400' : 'text-gray-500'}`}>
            {formData.name.length}/60
          </span>
        </div>
      </div>

      {/* Email */}
      <div className="group">
        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1.5 group-focus-within:text-indigo-400 transition-colors">
          Email Address
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          placeholder="email@example.com"
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
        />
      </div>

      {/* Address */}
      <div className="group">
        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1.5 group-focus-within:text-indigo-400 transition-colors">
          Address
        </label>
        <textarea
          name="address"
          value={formData.address}
          onChange={handleChange}
          required
          placeholder="Your physical address..."
          rows={2}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all resize-none"
        />
      </div>

      {/* Password */}
      <div className="group">
        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1.5 group-focus-within:text-indigo-400 transition-colors">
          Password
        </label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
          placeholder="Min. 8 chars + Special"
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-xl font-bold shadow-lg shadow-indigo-500/20 active:scale-[0.98] transition-all disabled:opacity-50 disabled:active:scale-100"
      >
        {loading ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Creating Account...
          </span>
        ) : (
          'Get Started'
        )}
      </button>

    </form>

    {/* Footer Link */}
    <div className="mt-8 pt-6 border-t border-white/5 text-center">
      <p className="text-sm text-gray-500">
        Already have an account?{' '}
        <Link to="/login" className="text-indigo-400 font-semibold hover:text-indigo-300 transition-colors">
          Login here
        </Link>
      </p>
    </div>

  </div>
</div>
  )
}

export default Register
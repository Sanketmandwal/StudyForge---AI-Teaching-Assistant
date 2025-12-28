import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import authService from '../../services/authService'
import toast from 'react-hot-toast'
import { User, Mail, Lock, Eye, EyeOff, UserPlus, Sparkles, Check, X } from 'lucide-react'

const RegisterPage = () => {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [focusedField, setFocusedField] = useState(null)

  const navigate = useNavigate()

  
  const calculatePasswordStrength = (pass) => {
    let score = 0
    if (!pass) return { score: 0, text: '', color: '' }

   
    if (pass.length >= 8) score++
    if (pass.length >= 12) score++

   
    if (/[a-z]/.test(pass)) score++
    if (/[A-Z]/.test(pass)) score++
    if (/[0-9]/.test(pass)) score++
    if (/[^A-Za-z0-9]/.test(pass)) score++

    if (score <= 2) return { score, text: 'Weak', color: 'bg-red-500' }
    if (score <= 4) return { score, text: 'Medium', color: 'bg-yellow-500' }
    return { score, text: 'Strong', color: 'bg-green-500' }
  }

  const passwordStrength = calculatePasswordStrength(password)

  
  const requirements = [
    { met: password.length >= 8, text: 'At least 8 characters' },
    { met: /[a-z]/.test(password), text: 'One lowercase letter' },
    { met: /[A-Z]/.test(password), text: 'One uppercase letter' },
    { met: /[0-9]/.test(password), text: 'One number' },
  ]

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      toast.error('Passwords do not match')
      return
    }

    if (passwordStrength.score < 3) {
      setError('Please choose a stronger password')
      toast.error('Please choose a stronger password')
      return
    }

    setLoading(true)
    try {
      await authService.register(email, password, username)
      toast.success('Registration successful! Please login.')
      navigate('/login')
    } catch (error) {
      setError(error.message || 'Registration failed')
      toast.error(error.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 py-12">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-50 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-50 rounded-full blur-3xl opacity-50"></div>
      </div>

      
      <div className="relative w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 relative overflow-hidden">
          {/* Top accent */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500"></div>

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
            <p className="text-gray-500">Join us today and get started</p>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm flex items-start gap-2">
              <span className="font-medium">⚠️ {error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <User className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onFocus={() => setFocusedField('username')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="johndoe"
                  required
                  className={`w-full pl-12 pr-4 py-3.5 bg-gray-50 border-2 rounded-xl outline-none transition-all duration-200 ${
                    focusedField === 'username'
                      ? 'border-purple-500 bg-white shadow-lg shadow-purple-100'
                      : 'border-transparent hover:bg-gray-100'
                  }`}
                />
              </div>
            </div>

            {/* Email Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="you@example.com"
                  required
                  className={`w-full pl-12 pr-4 py-3.5 bg-gray-50 border-2 rounded-xl outline-none transition-all duration-200 ${
                    focusedField === 'email'
                      ? 'border-purple-500 bg-white shadow-lg shadow-purple-100'
                      : 'border-transparent hover:bg-gray-100'
                  }`}
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Create a strong password"
                  required
                  className={`w-full pl-12 pr-12 py-3.5 bg-gray-50 border-2 rounded-xl outline-none transition-all duration-200 ${
                    focusedField === 'password'
                      ? 'border-purple-500 bg-white shadow-lg shadow-purple-100'
                      : 'border-transparent hover:bg-gray-100'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              {/* Password Strength Indicator */}
              {password && (
                <div className="mt-3 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Password strength:</span>
                    <span className={`font-semibold ${
                      passwordStrength.text === 'Weak' ? 'text-red-600' :
                      passwordStrength.text === 'Medium' ? 'text-yellow-600' :
                      'text-green-600'
                    }`}>
                      {passwordStrength.text}
                    </span>
                  </div>
                  <div className="flex gap-1.5">
                    {[...Array(6)].map((_, i) => (
                      <div
                        key={i}
                        className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                          i < passwordStrength.score ? passwordStrength.color : 'bg-gray-200'
                        }`}
                      />
                    ))}
                  </div>
                  
                  {/* Requirements checklist */}
                  <div className="grid grid-cols-2 gap-2 mt-3">
                    {requirements.map((req, i) => (
                      <div key={i} className="flex items-center gap-1.5 text-xs">
                        {req.met ? (
                          <Check className="w-3.5 h-3.5 text-green-600" />
                        ) : (
                          <X className="w-3.5 h-3.5 text-gray-300" />
                        )}
                        <span className={req.met ? 'text-green-600' : 'text-gray-400'}>
                          {req.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onFocus={() => setFocusedField('confirmPassword')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Re-enter your password"
                  required
                  className={`w-full pl-12 pr-12 py-3.5 bg-gray-50 border-2 rounded-xl outline-none transition-all duration-200 ${
                    focusedField === 'confirmPassword'
                      ? 'border-purple-500 bg-white shadow-lg shadow-purple-100'
                      : 'border-transparent hover:bg-gray-100'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {confirmPassword && password !== confirmPassword && (
                <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                  <X className="w-4 h-4" />
                  Passwords do not match
                </p>
              )}
              {confirmPassword && password === confirmPassword && (
                <p className="mt-2 text-sm text-green-600 flex items-center gap-1">
                  <Check className="w-4 h-4" />
                  Passwords match
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3.5 rounded-xl font-semibold shadow-lg shadow-purple-200 hover:shadow-xl hover:shadow-purple-300 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 group mt-6"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Creating account...</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <UserPlus className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">Already have an account?</span>
            </div>
          </div>

          {/* Login Link */}
          <div className="text-center">
            <Link
              to="/login"
              className="inline-flex items-center justify-center w-full py-3.5 border-2 border-gray-200 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
            >
              Sign in instead
            </Link>
          </div>
        </div>

        {/* Footer text */}
        <p className="text-center text-sm text-gray-500 mt-6">
          By creating an account, you agree to our{' '}
          <Link to="/terms" className="text-purple-600 hover:underline">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link to="/privacy" className="text-purple-600 hover:underline">
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  )
}

export default RegisterPage

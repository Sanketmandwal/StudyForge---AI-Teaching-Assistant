import React, { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import authService from '../../services/authService.js'
import { Mail, Lock, Eye, EyeOff, LogIn, Sparkles } from 'lucide-react'

const LoginPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [focusedField, setFocusedField] = useState(null)

  const navigate = useNavigate()
  const { login } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const data = await authService.login(email, password)
      login(data.data.token, data.data.user)
      toast.success('Login successful')
      navigate('/dashboard')
    } catch (error) {
      setError(error.message || 'Login failed')
      toast.error(error.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-50 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-50 rounded-full blur-3xl opacity-50"></div>
      </div>

      {/* Login Container */}
      <div className="relative w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 relative overflow-hidden">
          {/* Top accent */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back</h1>
            <p className="text-gray-500">Enter your credentials to continue</p>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm flex items-start gap-2">
              <span className="font-medium">⚠️ {error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
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
                      ? 'border-blue-500 bg-white shadow-lg shadow-blue-100'
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
                  placeholder="Enter your password"
                  required
                  className={`w-full pl-12 pr-12 py-3.5 bg-gray-50 border-2 rounded-xl outline-none transition-all duration-200 ${
                    focusedField === 'password'
                      ? 'border-blue-500 bg-white shadow-lg shadow-blue-100'
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
            </div>

            {/* Forgot Password */}
            <div className="text-right">
              <Link
                to="/forgot-password"
                className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3.5 rounded-xl font-semibold shadow-lg shadow-blue-200 hover:shadow-xl hover:shadow-blue-300 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign in</span>
                  <LogIn className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
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
              <span className="px-4 bg-white text-gray-500">New to our platform?</span>
            </div>
          </div>

          {/* Sign Up Link */}
          <div className="text-center">
            <Link
              to="/register"
              className="inline-flex items-center justify-center w-full py-3.5 border-2 border-gray-200 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
            >
              Create an account
            </Link>
          </div>
        </div>

        {/* Footer text */}
        <p className="text-center text-sm text-gray-500 mt-6">
          By continuing, you agree to our{' '}
          <Link to="/terms" className="text-blue-600 hover:underline">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link to="/privacy" className="text-blue-600 hover:underline">
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  )
}

export default LoginPage

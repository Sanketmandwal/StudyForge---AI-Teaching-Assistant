import React, { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { 
  LayoutDashboard, 
  FileText, 
  CreditCard, 
  User, 
  LogOut, 
  Settings,
  ChevronDown,
  Sparkles,
  Menu,
  X
} from 'lucide-react'

const Navbar = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const dropdownRef = useRef(null)
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Documents', path: '/documents', icon: FileText },
    { name: 'Flashcards', path: '/flashcard', icon: CreditCard },
  ]

  const isActive = (path) => location.pathname === path

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-white/80 backdrop-blur-lg shadow-lg' : 'bg-white shadow-md'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
       
          <Link to="/dashboard" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl blur-md opacity-50 group-hover:opacity-75 transition-opacity"></div>
    
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              StudyForge
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-2">
            {navLinks.map((link) => {
              const Icon = link.icon
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative px-4 py-2 rounded-xl font-medium transition-all duration-200 flex items-center gap-2 group ${
                    isActive(link.path)
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.name}</span>
                  {isActive(link.path) && (
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"></div>
                  )}
                </Link>
              )
            })}
          </div>
          <div className="hidden md:block relative" ref={dropdownRef}>
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-gray-50 transition-all duration-200 group"
            >
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-900">
                  {user?.username || 'User'}
                </p>
                <p className="text-xs text-gray-500">
                  {user?.email || 'user@example.com'}
                </p>
              </div>
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  {user?.username?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
              </div>
              <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                isProfileOpen ? 'rotate-180' : ''
              }`} />
            </button>
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
             
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-sm font-semibold text-gray-900">
                    {user?.username || 'User'}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {user?.email || 'user@example.com'}
                  </p>
                </div>

                <div className="py-2">
                  <Link
                    to="/profile"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                      <User className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">My Profile</p>
                      <p className="text-xs text-gray-500">View and edit profile</p>
                    </div>
                  </Link>

                 
                </div>

                <div className="border-t border-gray-100 pt-2 pb-1">
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors w-full"
                  >
                    <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center">
                      <LogOut className="w-4 h-4 text-red-600" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium">Log out</p>
                      <p className="text-xs text-red-500">Sign out of your account</p>
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-gray-600" />
            ) : (
              <Menu className="w-6 h-6 text-gray-600" />
            )}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 animate-in slide-in-from-top-4 duration-300">
          <div className="px-4 py-4 space-y-2">
            {navLinks.map((link) => {
              const Icon = link.icon
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    isActive(link.path)
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{link.name}</span>
                </Link>
              )
            })}

            <div className="pt-4 border-t border-gray-100 space-y-2">
              <Link
                to="/profile"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors"
              >
                <User className="w-5 h-5" />
                <span className="font-medium">My Profile</span>
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-colors w-full"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Log out</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar

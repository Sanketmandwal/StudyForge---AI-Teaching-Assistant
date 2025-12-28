import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import authService from '../../services/authService'
import { useAuth } from '../../context/AuthContext'
import PageHeader from '../../components/common/PageHeader'
import Button from '../../components/common/Button'
import Spinner from '../../components/common/Spinner'
import toast from 'react-hot-toast'
import {
  User,
  Mail,
  Lock,
  Edit2,
  Save,
  X,
  Eye,
  EyeOff,
  Shield,
  LogOut,
  Camera,
  CheckCircle,
  AlertCircle
} from 'lucide-react'

const ProfilePage = () => {
  const navigate = useNavigate()
  const { user, logout, updateUser } = useAuth()
  
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState(null)
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [saving, setSaving] = useState(false)

  // Profile form state
  const [profileForm, setProfileForm] = useState({
    username: '',
    email: ''
  })

  // Password form state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  // Password visibility toggles
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  })

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    setLoading(true)
    try {
      const response = await authService.getProfile()
      console.log(response)
      const userData = response.data || response.user || response
      setProfile(userData)
      setProfileForm({
        username: userData.username || '',
        email: userData.email || ''
      })
    } catch (error) {
      console.error('Fetch profile error:', error)
      toast.error(error.message || "Failed to load profile")
    } finally {
      setLoading(false)
    }
  }

  const handleProfileSubmit = async (e) => {
    e.preventDefault()
    
    if (!profileForm.username.trim()) {
      toast.error("Username is required")
      return
    }
    
    if (!profileForm.email.trim()) {
      toast.error("Email is required")
      return
    }

    setSaving(true)
    try {
      const response = await authService.updateProfile(profileForm)
      const updatedUser = response.data || response.user || response
      
      setProfile(updatedUser)
      updateUser(updatedUser) // Update context
      setIsEditingProfile(false)
      toast.success("Profile updated successfully!")
    } catch (error) {
      console.error('Update profile error:', error)
      toast.error(error.message || "Failed to update profile")
    } finally {
      setSaving(false)
    }
  }

  const handlePasswordSubmit = async (e) => {
    e.preventDefault()

    if (!passwordForm.currentPassword) {
      toast.error("Current password is required")
      return
    }

    if (!passwordForm.newPassword) {
      toast.error("New password is required")
      return
    }

    if (passwordForm.newPassword.length < 6) {
      toast.error("New password must be at least 6 characters")
      return
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("Passwords do not match")
      return
    }

    setSaving(true)
    try {
      await authService.changePassword({
        oldPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      })
      
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
      setIsChangingPassword(false)
      toast.success("Password changed successfully!")
    } catch (error) {
      console.error('Change password error:', error)
      toast.error(error.message || "Failed to change password")
    } finally {
      setSaving(false)
    }
  }

  const handleCancelEdit = () => {
    setProfileForm({
      username: profile.username || '',
      email: profile.email || ''
    })
    setIsEditingProfile(false)
  }

  const handleCancelPassword = () => {
    setPasswordForm({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    })
    setIsChangingPassword(false)
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
    toast.success("Logged out successfully")
  }

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }))
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner variant="pulse" fullScreen={false} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <PageHeader 
        title="My Profile"
        subtitle="Manage your account settings and preferences"
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sidebar - Profile Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-6">
              {/* Avatar */}
              <div className="relative w-32 h-32 mx-auto mb-6">
                <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-lg">
                  {profile?.username?.charAt(0).toUpperCase() || 'U'}
                </div>
                <button className="absolute bottom-0 right-0 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center border-2 border-gray-100 hover:bg-gray-50 transition-colors">
                  <Camera className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              {/* User Info */}
              <div className="text-center mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-1">
                  {profile?.username || 'User'}
                </h2>
                <p className="text-sm text-gray-600">
                  {profile?.email || 'email@example.com'}
                </p>
              </div>

              {/* Stats */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">Member since</span>
                  <span className="text-sm font-medium text-gray-900">
                    {profile?.createdAt 
                      ? new Date(profile.createdAt).toLocaleDateString()
                      : 'N/A'
                    }
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <span className="text-sm text-gray-600">Status</span>
                  <span className="flex items-center gap-1 text-sm font-medium text-green-600">
                    <CheckCircle className="w-4 h-4" />
                    Active
                  </span>
                </div>
              </div>

              {/* Logout Button */}
              <Button
                onClick={handleLogout}
                leftIcon={<LogOut className="w-4 h-4" />}
                variant="danger"
                fullWidth
              >
                Logout
              </Button>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Information Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <User className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Profile Information</h3>
                    <p className="text-sm text-gray-600">Update your account details</p>
                  </div>
                </div>
                {!isEditingProfile && (
                  <Button
                    onClick={() => setIsEditingProfile(true)}
                    leftIcon={<Edit2 className="w-4 h-4" />}
                    variant="outline"
                    size="sm"
                  >
                    Edit
                  </Button>
                )}
              </div>

              {isEditingProfile ? (
                <form onSubmit={handleProfileSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Username
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        value={profileForm.username}
                        onChange={(e) => setProfileForm({ ...profileForm, username: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-xl outline-none transition-all"
                        placeholder="Enter your username"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        value={profileForm.email}
                        onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-xl outline-none transition-all"
                        placeholder="Enter your email"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <Button
                      type="submit"
                      isLoading={saving}
                      disabled={saving}
                      leftIcon={<Save className="w-4 h-4" />}
                      fullWidth
                    >
                      Save Changes
                    </Button>
                    <Button
                      type="button"
                      onClick={handleCancelEdit}
                      variant="secondary"
                      disabled={saving}
                      fullWidth
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                    <User className="w-5 h-5 text-gray-400" />
                    <div className="flex-1">
                      <p className="text-xs text-gray-500">Username</p>
                      <p className="text-sm font-medium text-gray-900">{profile?.username || 'N/A'}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <div className="flex-1">
                      <p className="text-xs text-gray-500">Email Address</p>
                      <p className="text-sm font-medium text-gray-900">{profile?.email || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Change Password Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Shield className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Security</h3>
                    <p className="text-sm text-gray-600">Update your password</p>
                  </div>
                </div>
                {!isChangingPassword && (
                  <Button
                    onClick={() => setIsChangingPassword(true)}
                    leftIcon={<Lock className="w-4 h-4" />}
                    variant="outline"
                    size="sm"
                  >
                    Change Password
                  </Button>
                )}
              </div>

              {isChangingPassword ? (
                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Current Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type={showPasswords.current ? "text" : "password"}
                        value={passwordForm.currentPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                        className="w-full pl-10 pr-12 py-3 bg-gray-50 border-2 border-transparent focus:border-purple-500 focus:bg-white rounded-xl outline-none transition-all"
                        placeholder="Enter current password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility('current')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPasswords.current ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      New Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type={showPasswords.new ? "text" : "password"}
                        value={passwordForm.newPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                        className="w-full pl-10 pr-12 py-3 bg-gray-50 border-2 border-transparent focus:border-purple-500 focus:bg-white rounded-xl outline-none transition-all"
                        placeholder="Enter new password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility('new')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPasswords.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Must be at least 6 characters</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type={showPasswords.confirm ? "text" : "password"}
                        value={passwordForm.confirmPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                        className="w-full pl-10 pr-12 py-3 bg-gray-50 border-2 border-transparent focus:border-purple-500 focus:bg-white rounded-xl outline-none transition-all"
                        placeholder="Confirm new password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility('confirm')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPasswords.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {passwordForm.newPassword && passwordForm.confirmPassword && 
                   passwordForm.newPassword !== passwordForm.confirmPassword && (
                    <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                      <p className="text-sm text-red-600">Passwords do not match</p>
                    </div>
                  )}

                  <div className="flex gap-3 pt-2">
                    <Button
                      type="submit"
                      isLoading={saving}
                      disabled={saving}
                      leftIcon={<Save className="w-4 h-4" />}
                      fullWidth
                    >
                      Update Password
                    </Button>
                    <Button
                      type="button"
                      onClick={handleCancelPassword}
                      variant="secondary"
                      disabled={saving}
                      fullWidth
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-green-900">Password is secure</p>
                      <p className="text-xs text-green-700 mt-1">
                        Your password was last updated recently. Click "Change Password" to update it.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage

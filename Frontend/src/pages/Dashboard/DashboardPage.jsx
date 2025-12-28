import React, { useEffect, useState } from 'react'
import progressService from '../../services/progressService.js'
import toast from 'react-hot-toast'
import Spinner from '../../components/common/Spinner.jsx'
import {
  FileText,
  CreditCard,
  ClipboardCheck,
  TrendingUp,
  Clock,
  Calendar,
  BarChart3,
  ArrowUpRight,
  Award,
  Zap,
  Target,
  Brain,
  Flame,
  Star,
  BookOpen,
  CheckCircle2,
  Trophy
} from 'lucide-react'
import { Link } from 'react-router-dom'

const DashboardPage = () => {
  const [dashboardData, setDashboardData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const data = await progressService.getDashboardData()
        console.log("Dashboard Data:", data)
        setDashboardData(data.data)
      } catch (error) {
        toast.error(error.message || "Failed to load dashboard data")
      } finally {
        setLoading(false)
      }
    }
    fetchDashboardData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner variant="pulse" size="large" />
      </div>
    )
  }

  if (!dashboardData || !dashboardData.overview) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-50 to-purple-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <BarChart3 className="w-8 h-8 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No dashboard data available</h3>
          <p className="text-gray-500">Start by creating some documents or flashcards</p>
        </div>
      </div>
    )
  }

  const stats = [
    {
      label: 'Total Documents',
      value: dashboardData.overview.totalDocuments || 0,
      icon: FileText,
      gradient: 'from-blue-500 to-cyan-500',
      bgGradient: 'from-blue-500/10 to-cyan-500/10',
      iconColor: 'text-blue-600',
    },
    {
      label: 'Flashcard Sets',
      value: dashboardData.overview.totalFlashcardSets || 0,
      icon: CreditCard,
      gradient: 'from-purple-500 to-pink-500',
      bgGradient: 'from-purple-500/10 to-pink-500/10',
      iconColor: 'text-purple-600',
    },
    {
      label: 'Quizzes Completed',
      value: dashboardData.overview.completedQuizzes || 0,
      icon: ClipboardCheck,
      gradient: 'from-orange-500 to-red-500',
      bgGradient: 'from-orange-500/10 to-red-500/10',
      iconColor: 'text-orange-600',
    },
    {
      label: 'Average Score',
      value: `${dashboardData.overview.averageScore || 0}%`,
      icon: Award,
      gradient: 'from-green-500 to-emerald-500',
      bgGradient: 'from-green-500/10 to-emerald-500/10',
      iconColor: 'text-green-600',
    },
  ]

  // Format timestamp to relative time
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'Recently'
    const date = new Date(timestamp)
    const now = new Date()
    const diff = Math.floor((now - date) / 1000)

    if (diff < 60) return 'Just now'
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
    if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`
    return date.toLocaleDateString()
  }

  // Combine and format recent activities
  const recentActivities = [
    ...(dashboardData.recentActivity?.documents || []).map(doc => ({
      id: doc._id,
      title: doc.title || 'Untitled Document',
      description: 'Document',
      timestamp: doc.lastAccessed || doc.createdAt,
      link: `/documents/${doc._id}`,
      type: 'document',
      icon: FileText,
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
      gradient: 'from-blue-500 to-cyan-500'
    })),
    ...(dashboardData.recentActivity?.quizzes || []).map(quiz => ({
      id: quiz._id,
      title: quiz.title || 'Untitled Quiz',
      description: `Score: ${quiz.score || 0}%`,
      timestamp: quiz.completedAt,
      link: `/quizzes/${quiz._id}/results`,
      type: 'quiz',
      icon: ClipboardCheck,
      bgColor: 'bg-orange-50',
      iconColor: 'text-orange-600',
      gradient: 'from-orange-500 to-red-500',
      score: quiz.score || 0
    }))
  ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 6)

  // Get real data from backend
  const currentStreak = dashboardData.overview.studyStreak || 0
  const totalStudyTime = dashboardData.overview.totalStudyTime || '0h 0m'
  const completionRate = dashboardData.overview.completionRate || 0
  const studiedToday = dashboardData.overview.studiedToday || false
  const weeklyActivities = dashboardData.overview.weeklyActivities || 0
  const studyConsistency = dashboardData.insights?.studyConsistency || 0

  return (
    <div className="space-y-6 pb-8">
    

      {/* Stats Grid with Hover Effects */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div
              key={index}
              className="group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-gray-100 overflow-hidden"
            >
              {/* Animated Gradient Background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>

              {/* Content */}
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.gradient} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  {stat.change && (
                    <div className={`flex items-center gap-1 px-2 py-1 rounded-lg ${
                      stat.changeType === 'up' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                    }`}>
                      <TrendingUp className="w-3 h-3" />
                      <span className="text-xs font-bold">{stat.change}</span>
                    </div>
                  )}
                </div>

                <div>
                  <p className="text-gray-600 text-sm font-medium mb-2">
                    {stat.label}
                  </p>
                  <p className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                    {stat.value}
                  </p>
                </div>
              </div>

              {/* Decorative Element */}
              <div className={`absolute -bottom-2 -right-2 w-24 h-24 bg-gradient-to-br ${stat.gradient} opacity-5 rounded-full group-hover:scale-150 transition-transform duration-500`}></div>
            </div>
          )
        })}
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity - 2 columns */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 px-6 py-5 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <Clock className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
                  <p className="text-sm text-gray-600">Your latest study sessions</p>
                </div>
              </div>
              <Link
                to="/documents"
                className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 group"
              >
                View all
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            </div>
          </div>

          <div className="p-6">
            {recentActivities.length > 0 ? (
              <div className="space-y-3">
                {recentActivities.map((activity) => {
                  const Icon = activity.icon
                  return (
                    <Link
                      key={activity.id}
                      to={activity.link}
                      className="group flex items-center gap-4 p-4 rounded-xl hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50 transition-all duration-200 border-2 border-transparent hover:border-blue-100"
                    >
                      <div className={`relative p-3 rounded-xl bg-gradient-to-br ${activity.gradient} shadow-md group-hover:scale-110 transition-transform`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors truncate mb-1">
                          {activity.title}
                        </p>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500">{activity.description}</span>
                          {activity.score !== undefined && activity.score >= 80 && (
                            <div className="flex items-center gap-1 px-2 py-0.5 bg-green-100 rounded-full">
                              <CheckCircle2 className="w-3 h-3 text-green-600" />
                              <span className="text-xs font-medium text-green-700">Excellent</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-gray-400 whitespace-nowrap">
                          {formatTimestamp(activity.timestamp)}
                        </span>
                        <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 opacity-0 group-hover:opacity-100 transition-all" />
                      </div>
                    </Link>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500 text-sm font-medium mb-1">No recent activity yet</p>
                <p className="text-gray-400 text-xs">Start studying to see your activity here</p>
              </div>
            )}
          </div>
        </div>

        {/* Study Insights - 1 column */}
        <div className="space-y-6">
          {/* Study Goals */}
          <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl p-6 shadow-xl text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <Target className="w-5 h-5" />
                <h3 className="font-bold text-lg">Weekly Activity</h3>
              </div>
              
              <div className="mb-4">
                <div className="flex items-end gap-2 mb-2">
                  <span className="text-4xl font-bold">{weeklyActivities}</span>
                  <span className="text-white/80 text-sm mb-1">activities</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
                  <div className="bg-white h-full rounded-full transition-all duration-500" style={{ width: `${Math.min(100, (weeklyActivities / 20) * 100)}%` }}></div>
                </div>
              </div>
              
              <p className="text-white/90 text-sm">
                {weeklyActivities >= 10 
                  ? "Amazing! You're very active this week! 🎉"
                  : "Keep going! Try to study more this week! 💪"
                }
              </p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Brain className="w-5 h-5 text-indigo-600" />
              <h3 className="font-bold text-gray-900">Study Insights</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500 rounded-lg">
                    <BookOpen className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">Documents Read</span>
                </div>
                <span className="text-lg font-bold text-gray-900">{dashboardData.overview.totalDocuments || 0}</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-500 rounded-lg">
                    <Star className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">Avg. Performance</span>
                </div>
                <span className="text-lg font-bold text-gray-900">{dashboardData.overview.averageScore || 0}%</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-500 rounded-lg">
                    <Zap className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">Consistency</span>
                </div>
                <span className="text-lg font-bold text-gray-900">{studyConsistency}%</span>
              </div>
            </div>
          </div>

          {/* Motivation Card */}
          <div className="bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl p-6 shadow-xl text-white relative overflow-hidden">
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
            
            <div className="relative z-10">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-3">
                <Flame className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg mb-2">
                {currentStreak > 0 ? 'Keep the streak!' : 'Start your streak!'}
              </h3>
              <p className="text-white/90 text-sm">
                {currentStreak > 0 
                  ? `You're on fire! 🔥 Study today to maintain your ${currentStreak}-day streak.`
                  : "Begin your learning journey today and build a study streak! 🚀"
                }
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage

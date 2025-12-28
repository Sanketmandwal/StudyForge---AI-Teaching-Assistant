import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Spinner from '../../components/common/Spinner'
import PageHeader from '../../components/common/PageHeader'
import Button from '../../components/common/Button'
import flashcardService from '../../services/flashcardService'
import toast from 'react-hot-toast'
import moment from 'moment'
import { 
  CreditCard, 
  BookOpen, 
  Star, 
  TrendingUp, 
  Calendar,
  Grid3x3,
  Layers,
  Filter,
  Search,
  CheckCircle
} from 'lucide-react'

const FlashcardListPage = () => {
  const navigate = useNavigate()
  const [flashcardSets, setFlashcardSets] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStarred, setFilterStarred] = useState(false)

  useEffect(() => {
    fetchAllFlashcards()
  }, [])

  const fetchAllFlashcards = async () => {
    setLoading(true)
    try {
      const response = await flashcardService.getAllFlashcardSets()
      const sets = response.data || response.flashcardSets || response
      setFlashcardSets(Array.isArray(sets) ? sets : [])
    } catch (error) {
      console.error('Fetch flashcards error:', error)
      toast.error(error.message || "Failed to fetch flashcards")
      setFlashcardSets([])
    } finally {
      setLoading(false)
    }
  }

  const handleViewSet = (documentId, setId) => {
    // Navigate directly to flashcard study page with the specific set
    navigate(`/documents/${documentId}/flashcard`, { 
      state: { setId: setId, autoStart: true } 
    })
  }

  // Filter and search logic
  const filteredSets = flashcardSets.filter(set => {
    const matchesSearch = set.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         set.documentId?.title?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStarred = !filterStarred || set.cards?.some(card => card.isStarred)
    return matchesSearch && matchesStarred
  })

  // Calculate stats
  const totalCards = flashcardSets.reduce((sum, set) => sum + (set.cards?.length || 0), 0)
  const totalStarred = flashcardSets.reduce((sum, set) => 
    sum + (set.cards?.filter(c => c.isStarred).length || 0), 0
  )
  const totalSets = flashcardSets.length

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
        title="My Flashcards"
        subtitle="Review all your flashcard sets from different documents"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Layers className="w-6 h-6" />
              </div>
              <TrendingUp className="w-5 h-5 opacity-70" />
            </div>
            <p className="text-3xl font-bold mb-1">{totalSets}</p>
            <p className="text-sm opacity-90">Flashcard Sets</p>
          </div>

          <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <CreditCard className="w-6 h-6" />
              </div>
              <Grid3x3 className="w-5 h-5 opacity-70" />
            </div>
            <p className="text-3xl font-bold mb-1">{totalCards}</p>
            <p className="text-sm opacity-90">Total Cards</p>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Star className="w-6 h-6 fill-white" />
              </div>
              <CheckCircle className="w-5 h-5 opacity-70" />
            </div>
            <p className="text-3xl font-bold mb-1">{totalStarred}</p>
            <p className="text-sm opacity-90">Starred Cards</p>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search flashcard sets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-transparent focus:border-purple-500 focus:bg-white rounded-xl outline-none transition-all"
              />
            </div>
            <button
              onClick={() => setFilterStarred(!filterStarred)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                filterStarred
                  ? 'bg-yellow-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Star className={`w-5 h-5 ${filterStarred ? 'fill-white' : ''}`} />
              <span>Starred Only</span>
            </button>
          </div>
        </div>

        {/* Flashcard Sets Grid */}
        {filteredSets.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-50 to-pink-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <CreditCard className="w-10 h-10 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {searchQuery || filterStarred ? 'No Matching Flashcards' : 'No Flashcards Yet'}
            </h3>
            <p className="text-gray-600 max-w-md mx-auto mb-6">
              {searchQuery || filterStarred 
                ? 'Try adjusting your search or filters'
                : 'Create flashcards from your documents to start studying'
              }
            </p>
            {!searchQuery && !filterStarred && (
              <Button
                onClick={() => navigate('/documents')}
                leftIcon={<BookOpen className="w-4 h-4" />}
              >
                Go to Documents
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSets.map((set) => {
              const starredCount = set.cards?.filter(c => c.isStarred).length || 0
              const cardCount = set.cards?.length || 0

              return (
                <div
                  key={set._id}
                  onClick={() => handleViewSet(set.documentId?._id || set.documentId, set._id)}
                  className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-purple-200 cursor-pointer group"
                >
                  {/* Icon & Document */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                      <CreditCard className="w-7 h-7 text-white" />
                    </div>
                    {starredCount > 0 && (
                      <div className="flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-700 rounded-lg text-xs font-medium">
                        <Star className="w-3 h-3 fill-yellow-500" />
                        <span>{starredCount}</span>
                      </div>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-purple-600 transition-colors">
                    {set.title || 'Untitled Flashcard Set'}
                  </h3>

                  {/* Document Info */}
                  {set.documentId && (
                    <div className="flex items-center gap-2 mb-3 text-sm text-gray-600">
                      <BookOpen className="w-4 h-4" />
                      <span className="line-clamp-1">
                        {set.documentId.title || set.documentId.fileName || 'Document'}
                      </span>
                    </div>
                  )}

                  {/* Stats */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Grid3x3 className="w-4 h-4" />
                      <span>{cardCount} cards</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>{moment(set.createdAt).fromNow()}</span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-3">
                    <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                      <span>Progress</span>
                      <span>0/{cardCount}</span>
                    </div>
                    <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div className="bg-gradient-to-r from-purple-500 to-pink-600 h-full" style={{ width: '0%' }} />
                    </div>
                  </div>

                  {/* Study Button */}
                  <Button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleViewSet(set.documentId?._id || set.documentId, set._id)
                    }}
                    size="sm"
                    fullWidth
                    variant="outline"
                  >
                    Study Now
                  </Button>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default FlashcardListPage

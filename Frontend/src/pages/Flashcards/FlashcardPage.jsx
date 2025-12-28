import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import flashcardService from '../../services/flashcardService'
import Spinner from '../../components/common/Spinner'
import Button from '../../components/common/Button'
import Flashcard from '../../components/flashcards/Flashcard'
import toast from 'react-hot-toast'
import {
  ChevronLeft,
  ArrowLeft,
  ArrowRight,
  Shuffle,
  Star,
  CheckCircle,
  Target,
  Trophy,
  RotateCcw
} from 'lucide-react'

const FlashcardPage = () => {
  const { id } = useParams() // documentId
  const navigate = useNavigate()
  const location = useLocation()
  
  const [flashcardSets, setFlashcardSets] = useState([])
  const [selectedSet, setSelectedSet] = useState(null)
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [reviewedCards, setReviewedCards] = useState(new Set())
  const [showStarredOnly, setShowStarredOnly] = useState(false)

  useEffect(() => {
    fetchFlashcards()
  }, [id])

  const fetchFlashcards = async () => {
    setLoading(true)
    try {
      const response = await flashcardService.getFlashcardsForDocuments(id)
      const sets = response.data || response.flashcardSets || response
      const setsArray = Array.isArray(sets) ? sets : []
      setFlashcardSets(setsArray)
      
      // If setId is provided in location state, select that set
      if (location.state?.setId && setsArray.length > 0) {
        const targetSet = setsArray.find(set => set._id === location.state.setId)
        setSelectedSet(targetSet || setsArray[0])
      }
      // Auto-select first set
      else if (setsArray.length > 0) {
        setSelectedSet(setsArray[0])
      }
    } catch (error) {
      console.error('Fetch flashcards error:', error)
      toast.error(error.message || "Failed to fetch flashcards")
    } finally {
      setLoading(false)
    }
  }

  const handleToggleStar = async (cardId) => {
    try {
      await flashcardService.toggleStar(cardId)
      
      // Update local state
      setFlashcardSets(prevSets =>
        prevSets.map(set => ({
          ...set,
          cards: set.cards.map(card =>
            card._id === cardId ? { ...card, isStarred: !card.isStarred } : card
          )
        }))
      )
      
      if (selectedSet) {
        setSelectedSet(prev => ({
          ...prev,
          cards: prev.cards.map(card =>
            card._id === cardId ? { ...card, isStarred: !card.isStarred } : card
          )
        }))
      }
      
      toast.success("Updated!")
    } catch (error) {
      console.error('Star error:', error)
      toast.error("Failed to update")
    }
  }

  const handleNextCard = () => {
    if (selectedSet) {
      setReviewedCards(prev => new Set([...prev, currentCardIndex]))
      const cards = getDisplayCards()
      setCurrentCardIndex((prev) => (prev + 1) % cards.length)
    }
  }

  const handlePrevCard = () => {
    if (selectedSet) {
      const cards = getDisplayCards()
      setCurrentCardIndex((prev) => prev === 0 ? cards.length - 1 : prev - 1)
    }
  }

  const handleShuffle = () => {
    if (selectedSet) {
      const cards = getDisplayCards()
      const randomIndex = Math.floor(Math.random() * cards.length)
      setCurrentCardIndex(randomIndex)
    }
  }

  const handleReset = () => {
    setReviewedCards(new Set())
    setCurrentCardIndex(0)
    toast.success("Progress reset!")
  }

  const getDisplayCards = () => {
    if (!selectedSet) return []
    if (showStarredOnly) {
      return selectedSet.cards.filter(card => card.isStarred)
    }
    return selectedSet.cards
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner variant="dots" fullScreen={false} />
      </div>
    )
  }

  if (!selectedSet || flashcardSets.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white">
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-50 to-pink-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Star className="w-10 h-10 text-purple-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No Flashcards Found</h2>
          <p className="text-gray-600 mb-6">Create flashcards from this document first</p>
          <Button onClick={() => navigate(-1)} leftIcon={<ChevronLeft className="w-4 h-4" />}>
            Go Back
          </Button>
        </div>
      </div>
    )
  }

  const displayCards = getDisplayCards()
  
  if (displayCards.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white">
        <div className="text-center">
          <Star className="w-20 h-20 text-yellow-500 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No Starred Cards</h2>
          <p className="text-gray-600 mb-6">You haven't starred any cards yet</p>
          <Button onClick={() => setShowStarredOnly(false)}>
            Show All Cards
          </Button>
        </div>
      </div>
    )
  }

  const currentCard = displayCards[currentCardIndex]
  const progress = ((reviewedCards.size / displayCards.length) * 100).toFixed(0)
  const starredCount = selectedSet.cards.filter(c => c.isStarred).length

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-pink-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button
            onClick={() => navigate(-1)}
            leftIcon={<ChevronLeft className="w-4 h-4" />}
            variant="ghost"
            className="mb-4"
          >
            Back
          </Button>
          
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-1">
                  {selectedSet.title || 'Flashcard Set'}
                </h1>
                <p className="text-gray-600">
                  Card {currentCardIndex + 1} of {displayCards.length}
                </p>
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => setShowStarredOnly(!showStarredOnly)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
                    showStarredOnly
                      ? 'bg-yellow-500 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Star className={`w-4 h-4 ${showStarredOnly ? 'fill-white' : ''}`} />
                  <span className="text-sm">Starred ({starredCount})</span>
                </button>
                
                <Button
                  onClick={handleShuffle}
                  leftIcon={<Shuffle className="w-4 h-4" />}
                  variant="secondary"
                  size="sm"
                >
                  Shuffle
                </Button>
                
                <Button
                  onClick={handleReset}
                  leftIcon={<RotateCcw className="w-4 h-4" />}
                  variant="secondary"
                  size="sm"
                >
                  Reset
                </Button>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-6">
              <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                <span>Study Progress</span>
                <span>{progress}%</span>
              </div>
              <div className="bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-purple-500 to-pink-600 h-full transition-all duration-500 rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Flashcard */}
        <div className="mb-8">
          <Flashcard
            flashcard={currentCard}
            onToggleStar={handleToggleStar}
          />
        </div>

        {/* Navigation Controls */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between gap-4">
            <Button
              onClick={handlePrevCard}
              leftIcon={<ArrowLeft className="w-4 h-4" />}
              variant="secondary"
              disabled={displayCards.length <= 1}
            >
              Previous
            </Button>

            <div className="flex gap-2 overflow-x-auto">
              {displayCards.slice(0, 10).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentCardIndex(index)}
                  className={`w-10 h-10 rounded-lg font-medium transition-all flex-shrink-0 ${
                    index === currentCardIndex
                      ? 'bg-purple-500 text-white shadow-md'
                      : reviewedCards.has(index)
                      ? 'bg-green-100 text-green-700 border-2 border-green-300'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {index + 1}
                </button>
              ))}
              {displayCards.length > 10 && (
                <span className="flex items-center text-gray-500 text-sm">
                  +{displayCards.length - 10} more
                </span>
              )}
            </div>

            <Button
              onClick={handleNextCard}
              rightIcon={<ArrowRight className="w-4 h-4" />}
              variant="secondary"
              disabled={displayCards.length <= 1}
            >
              Next
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-4 shadow-md">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{reviewedCards.size}</p>
                <p className="text-sm text-gray-600">Reviewed</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-md">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{displayCards.length}</p>
                <p className="text-sm text-gray-600">Total Cards</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-md">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Star className="w-5 h-5 text-yellow-600 fill-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{starredCount}</p>
                <p className="text-sm text-gray-600">Starred</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FlashcardPage

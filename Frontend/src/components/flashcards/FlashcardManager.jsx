import React, { useState, useEffect } from 'react'
import moment from 'moment'
import toast from 'react-hot-toast'
import flashcardService from '../../services/flashcardService'
import aiService from '../../services/aiService'
import Spinner from '../common/Spinner'
import Button from '../common/Button'
import Flashcard from './Flashcard'
import {
  CreditCard,
  ArrowLeft,
  ArrowRight,
  Shuffle,
  Star,
  Trash2,
  Plus,
  X,
  ChevronLeft,
  Grid3x3,
  CheckCircle
} from 'lucide-react'

const FlashcardManager = ({ documentId }) => {
  const [flashcardSets, setFlashcardSets] = useState([])
  const [selectedSet, setSelectedSet] = useState(null)
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [setToDelete, setSetToDelete] = useState(null)
  const [reviewedCards, setReviewedCards] = useState(new Set())

  const fetchFlashcardSets = async () => {
    setLoading(true)
    try {
      const response = await flashcardService.getFlashcardsForDocuments(documentId)
      console.log(response)
      const sets = response.data 
      setFlashcardSets(Array.isArray(sets) ? sets : [])
    } catch (error) {
      console.error('Fetch error:', error)
      toast.error(error.message || "Failed to fetch flashcard sets")
      setFlashcardSets([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (documentId) {
      fetchFlashcardSets()
    }
  }, [documentId])

  const handleGenerateFlashcards = async () => {
    setGenerating(true)
    try {
      await aiService.generateFlashcard(documentId)
      toast.success("Flashcards generated successfully!")
      await fetchFlashcardSets()
    } catch (error) {
      console.error('Generation error:', error)
      toast.error(error.message || "Failed to generate flashcards")
    } finally {
      setGenerating(false)
    }
  }

  const handleNextCard = () => {
    if (selectedSet) {
      setReviewedCards(prev => new Set([...prev, currentCardIndex]))
      setCurrentCardIndex((prev) => (prev + 1) % selectedSet.cards.length)
    }
  }

  const handlePrevCard = () => {
    if (selectedSet) {
      setCurrentCardIndex((prev) => 
        prev === 0 ? selectedSet.cards.length - 1 : prev - 1
      )
    }
  }

  const handleShuffle = () => {
    if (selectedSet) {
      const randomIndex = Math.floor(Math.random() * selectedSet.cards.length)
      setCurrentCardIndex(randomIndex)
    }
  }

  const handleReview = async (rating) => {
    const currentCard = selectedSet?.cards[currentCardIndex]
    if (!currentCard) return

    try {
      await flashcardService.reviewFlashcard(currentCard._id, rating)
      setReviewedCards(prev => new Set([...prev, currentCardIndex]))
      toast.success("Review recorded!")
    } catch (error) {
      console.error('Review error:', error)
      toast.error("Failed to record review")
    }
  }

  const handleToggleStar = async (cardId) => {
    try {
      await flashcardService.toggleStar(cardId)
      
    
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
      toast.error("Failed to update star")
    }
  }

  const handleDeleteRequest = (e, set) => {
    e.stopPropagation()
    setSetToDelete(set)
    setIsDeleteModalOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!setToDelete) return
    
    try {
      await flashcardService.deleteFlashcardSet(setToDelete._id)
      toast.success("Flashcard set deleted successfully!")
      setIsDeleteModalOpen(false)
      setSetToDelete(null)
      await fetchFlashcardSets()
    } catch (error) {
      console.error('Delete error:', error)
      toast.error("Failed to delete flashcard set")
    }
  }

  const handleSelectSet = (set) => {
    setSelectedSet(set)
    setCurrentCardIndex(0)
    setReviewedCards(new Set())
  }

  const handleBackToList = () => {
    setSelectedSet(null)
    setCurrentCardIndex(0)
    setReviewedCards(new Set())
  }

  const renderFlashcardViewer = () => {
    if (!selectedSet || !selectedSet.cards || selectedSet.cards.length === 0) {
      return (
        <div className="text-center py-12">
          <p className="text-gray-500">No flashcards in this set</p>
          <Button onClick={handleBackToList} className="mt-4">
            Back to Sets
          </Button>
        </div>
      )
    }

    const currentCard = selectedSet.cards[currentCardIndex]
    const progress = ((reviewedCards.size / selectedSet.cards.length) * 100).toFixed(0)

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button
            onClick={handleBackToList}
            leftIcon={<ChevronLeft className="w-4 h-4" />}
            variant="ghost"
          >
            Back to Sets
          </Button>
          <div className="text-center">
            <h2 className="text-xl font-bold text-gray-900">{selectedSet.title}</h2>
            <p className="text-sm text-gray-500">
              Card {currentCardIndex + 1} of {selectedSet.cards.length}
            </p>
          </div>
          <Button
            onClick={handleShuffle}
            leftIcon={<Shuffle className="w-4 h-4" />}
            variant="secondary"
            size="sm"
          >
            Shuffle
          </Button>
        </div>
        <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
          <div
            className="bg-gradient-to-r from-blue-500 to-purple-600 h-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="max-w-2xl mx-auto">
          <Flashcard
            flashcard={currentCard}
            onToggleStar={handleToggleStar}
          />
        </div>

        <div className="flex items-center justify-center gap-4 mt-8">
          <Button
            onClick={handlePrevCard}
            leftIcon={<ArrowLeft className="w-4 h-4" />}
            variant="secondary"
            disabled={selectedSet.cards.length <= 1}
          >
            Previous
          </Button>
          
          <div className="flex gap-2">
            <button
              onClick={() => handleReview(1)}
              className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors font-medium text-sm"
            >
              Hard
            </button>
            <button
              onClick={() => handleReview(2)}
              className="px-4 py-2 bg-yellow-100 hover:bg-yellow-200 text-yellow-700 rounded-lg transition-colors font-medium text-sm"
            >
              Good
            </button>
            <button
              onClick={() => handleReview(3)}
              className="px-4 py-2 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg transition-colors font-medium text-sm"
            >
              Easy
            </button>
          </div>

          <Button
            onClick={handleNextCard}
            rightIcon={<ArrowRight className="w-4 h-4" />}
            variant="secondary"
            disabled={selectedSet.cards.length <= 1}
          >
            Next
          </Button>
        </div>

        <div className="flex items-center justify-center gap-6 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span>Reviewed: {reviewedCards.size}/{selectedSet.cards.length}</span>
          </div>
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-yellow-500" />
            <span>
              Starred: {selectedSet.cards.filter(c => c.isStarred).length}
            </span>
          </div>
        </div>
      </div>
    )
  }

  const renderSetList = () => {
    if (loading) {
      return (
        <div className="flex justify-center py-16">
          <Spinner variant="pulse" fullScreen={false} />
        </div>
      )
    }

    if (flashcardSets.length === 0) {
      return (
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-50 to-pink-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <CreditCard className="w-10 h-10 text-purple-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No Flashcards Yet</h3>
          <p className="text-gray-600 max-w-md mx-auto mb-6">
            Generate flashcards from this document to start studying effectively.
          </p>
          <Button
            onClick={handleGenerateFlashcards}
            isLoading={generating}
            leftIcon={<Plus className="w-4 h-4" />}
            size="lg"
          >
            {generating ? 'Generating...' : 'Generate Flashcards'}
          </Button>
        </div>
      )
    }

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Flashcard Sets</h2>
            <p className="text-gray-600">
              {flashcardSets.length} set{flashcardSets.length !== 1 ? 's' : ''} available
            </p>
          </div>
          <Button
            onClick={handleGenerateFlashcards}
            isLoading={generating}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Generate More
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {flashcardSets.map((set) => (
            <div
              key={set._id}
              onClick={() => handleSelectSet(set)}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-purple-200 cursor-pointer group"
            >
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Grid3x3 className="w-7 h-7 text-white" />
              </div>

              <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-purple-600 transition-colors">
                {set.title || 'Flashcard Set'}
              </h3>
              <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                <span className="flex items-center gap-1">
                  <CreditCard className="w-4 h-4" />
                  {set.cards?.length || 0} cards
                </span>
                {set.cards && (
                  <span className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500" />
                    {set.cards.filter(c => c.isStarred).length}
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500 mb-4">
                Created {moment(set.createdAt).fromNow()}
              </p>
              <div className="flex gap-2">
                <Button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleSelectSet(set)
                  }}
                  size="sm"
                  fullWidth
                  variant="outline"
                >
                  Study
                </Button>
                <button
                  onClick={(e) => handleDeleteRequest(e, set)}
                  className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div>
      {selectedSet ? renderFlashcardViewer() : renderSetList()}

      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Delete Flashcard Set?</h2>
              <p className="text-gray-600">
                Are you sure you want to delete <span className="font-semibold">"{setToDelete?.title}"</span>? 
                This will delete all {setToDelete?.cards?.length || 0} flashcards in this set.
              </p>
            </div>

            <div className="flex gap-3">
              <Button
                variant="secondary"
                onClick={() => {
                  setIsDeleteModalOpen(false)
                  setSetToDelete(null)
                }}
                fullWidth
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={handleConfirmDelete}
                fullWidth
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default FlashcardManager

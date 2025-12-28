import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import aiService from '../../services/aiService'
import Spinner from '../common/Spinner'
import QuizCard from './QuizCard'
import Button from '../common/Button'
import quizService from '../../services/quizService.js'
import { ClipboardCheck, Plus, X, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'

const QuizManager = ({ documentId }) => {
  const navigate = useNavigate()
  const [quizzes, setQuizzes] = useState([])
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false)
  const [numQuestions, setNumQuestions] = useState(5)
  
  const [deleting, setDeleting] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedQuiz, setSelectedQuiz] = useState(null)

  const fetchQuizzes = async () => {
    setLoading(true)
    try {
      const response = await quizService.getQuizzesForDocument(documentId)
      const quizData = response.data || response.quizzes || response
      setQuizzes(Array.isArray(quizData) ? quizData : [])
    } catch (error) {
      console.error('Fetch quizzes error:', error)
      toast.error(error.message || "Failed to fetch quizzes")
      setQuizzes([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (documentId) {
      fetchQuizzes()
    }
  }, [documentId])

  const handleGenerateQuiz = async (e) => {
    e.preventDefault()
    setGenerating(true)
    try {
      await aiService.generateQuiz(documentId, { count: numQuestions })
      toast.success("Quiz generated successfully!")
      setIsGenerateModalOpen(false)
      setNumQuestions(5)
      await fetchQuizzes()
    } catch (error) {
      console.error('Generate quiz error:', error)
      toast.error(error.message || "Failed to generate quiz")
    } finally {
      setGenerating(false)
    }
  }

  const handleDeleteRequest = (quiz) => {
    setSelectedQuiz(quiz)
    setIsDeleteModalOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!selectedQuiz) return
    
    setDeleting(true)
    try {
      await quizService.deleteQuiz(selectedQuiz._id)
      toast.success("Quiz deleted successfully!")
      setIsDeleteModalOpen(false)
      setSelectedQuiz(null)
      await fetchQuizzes()
    } catch (error) {
      console.error('Delete quiz error:', error)
      toast.error(error.message || "Failed to delete quiz")
    } finally {
      setDeleting(false)
    }
  }

  const handleTakeQuiz = (quizId) => {
    navigate(`/quizzes/${quizId}`)
  }

  const handleViewResults = (quizId) => {
    navigate(`/quizzes/${quizId}/results`)
  }

  const renderQuizContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center py-16">
          <Spinner variant="pulse" fullScreen={false} />
        </div>
      )
    }

    if (quizzes.length === 0) {
      return (
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-gradient-to-br from-orange-50 to-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <ClipboardCheck className="w-10 h-10 text-orange-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No Quizzes Yet</h3>
          <p className="text-gray-600 max-w-md mx-auto mb-6">
            Generate a quiz from this document to test your knowledge.
          </p>
          <Button
            onClick={() => setIsGenerateModalOpen(true)}
            leftIcon={<Plus className="w-4 h-4" />}
            size="lg"
          >
            Generate Quiz
          </Button>
        </div>
      )
    }

    return (
      <div className="space-y-6">
   
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Quizzes</h2>
            <p className="text-gray-600">
              {quizzes.length} quiz{quizzes.length !== 1 ? 'zes' : ''} available
            </p>
          </div>
          <Button
            onClick={() => setIsGenerateModalOpen(true)}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Generate Quiz
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizzes.map((quiz) => (
            <QuizCard
              key={quiz._id}
              quiz={quiz}
              onTakeQuiz={handleTakeQuiz}
              onViewResults={handleViewResults}
              onDelete={handleDeleteRequest}
            />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div>
      {renderQuizContent()}

      {isGenerateModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative animate-in fade-in slide-in-from-bottom-4 duration-300">
            <button
              onClick={() => setIsGenerateModalOpen(false)}
              disabled={generating}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>

            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center mb-4">
              <ClipboardCheck className="w-6 h-6 text-white" />
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-2">Generate Quiz</h2>
            <p className="text-gray-600 text-sm mb-6">
              Create a quiz from your document to test your knowledge
            </p>

            <form onSubmit={handleGenerateQuiz} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Questions
                </label>
                <input
                  type="number"
                  value={numQuestions}
                  onChange={(e) => setNumQuestions(Math.max(1, Math.min(20, parseInt(e.target.value) || 5)))}
                  min="1"
                  max="20"
                  disabled={generating}
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent focus:border-orange-500 focus:bg-white rounded-xl outline-none transition-all disabled:opacity-50"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Choose between 1 and 20 questions</p>
              </div>

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setIsGenerateModalOpen(false)}
                  disabled={generating}
                  fullWidth
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  isLoading={generating}
                  disabled={generating}
                  fullWidth
                >
                  {generating ? 'Generating...' : 'Generate'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Delete Quiz?</h2>
              <p className="text-gray-600">
                Are you sure you want to delete <span className="font-semibold">"{selectedQuiz?.title}"</span>?
                This action cannot be undone.
              </p>
            </div>

            <div className="flex gap-3">
              <Button
                variant="secondary"
                onClick={() => {
                  setIsDeleteModalOpen(false)
                  setSelectedQuiz(null)
                }}
                disabled={deleting}
                fullWidth
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={handleConfirmDelete}
                isLoading={deleting}
                disabled={deleting}
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

export default QuizManager

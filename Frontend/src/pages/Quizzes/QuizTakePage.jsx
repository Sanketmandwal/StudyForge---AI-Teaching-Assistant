import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import quizService from '../../services/quizService'
import Button from '../../components/common/Button'
import Spinner from '../../components/common/Spinner'
import toast from 'react-hot-toast'
import { Clock, ChevronLeft, ChevronRight, Flag, AlertCircle } from 'lucide-react'

const QuizTakePage = () => {
  const { quizId } = useParams()
  const navigate = useNavigate()
  
  const [quiz, setQuiz] = useState(null)
  const [loading, setLoading] = useState(true)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState({}) // Fixed naming
  const [submitting, setSubmitting] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(null)

  useEffect(() => {
    fetchQuiz()
  }, [quizId])

  useEffect(() => {
    if (timeRemaining === null || timeRemaining <= 0) return
    
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          handleSubmit()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [timeRemaining])

  const fetchQuiz = async () => {
    try {
      const response = await quizService.getQuizById(quizId)
      const quizData = response.data || response.quiz || response
      
      if (quizData.completedAt && quizData.userAnswers && quizData.userAnswers.length > 0) {
        toast.info("This quiz has already been completed. Redirecting to results...")
        navigate(`/quizzes/${quizId}/results`)
        return
      }
      
      setQuiz(quizData)
      
      if (quizData.questions) {
        setTimeRemaining(quizData.questions.length * 120)
      }
    } catch (error) {
      console.error('Fetch quiz error:', error)
      toast.error(error.message || "Failed to load quiz")
      navigate(-1)
    } finally {
      setLoading(false)
    }
  }

  const handleAnswerSelect = (optionIndex) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion]: quiz.questions[currentQuestion].options[optionIndex]
    }))
  }

  const handleNext = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1)
    }
  }

  const handleSubmit = async () => {
    if (Object.keys(answers).length < quiz.questions.length) {
      const unanswered = quiz.questions.length - Object.keys(answers).length
      if (!window.confirm(`You have ${unanswered} unanswered question(s). Submit anyway?`)) {
        return
      }
    }

    setSubmitting(true)
    try {
      const formattedAnswers = quiz.questions.map((q, index) => ({
        questionIndex: index,
        selectedAnswer: answers[index] || ''
      }))

      console.log('Submitting answers:', formattedAnswers)
      await quizService.submitQuiz(quizId, formattedAnswers)
      
      toast.success("Quiz submitted successfully!")
      navigate(`/quizzes/${quizId}/results`)
    } catch (error) {
      console.error('Submit error:', error)
      toast.error(error.message || "Failed to submit quiz")
    } finally {
      setSubmitting(false)
    }
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner variant="dots" fullScreen={false} />
      </div>
    )
  }

  if (!quiz || !quiz.questions || quiz.questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Quiz Not Found</h2>
          <Button onClick={() => navigate(-1)}>Go Back</Button>
        </div>
      </div>
    )
  }

  const question = quiz.questions[currentQuestion]
  const selectedAnswer = answers[currentQuestion]
  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100
  const answeredCount = Object.keys(answers).length

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{quiz.title}</h1>
              <p className="text-sm text-gray-600 mt-1">
                Question {currentQuestion + 1} of {quiz.questions.length}
              </p>
            </div>
            
            {timeRemaining !== null && (
              <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                timeRemaining < 60 ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
              }`}>
                <Clock className="w-5 h-5" />
                <span className="font-mono font-bold">{formatTime(timeRemaining)}</span>
              </div>
            )}
          </div>

          <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-orange-500 to-red-600 h-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="mt-3 flex items-center gap-2 text-sm text-gray-600">
            <Flag className="w-4 h-4" />
            <span>Answered: {answeredCount}/{quiz.questions.length}</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <div className="mb-6">
            <span className="inline-block px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium mb-4">
              {question.difficulty || 'Medium'}
            </span>
            <h2 className="text-xl font-bold text-gray-900 leading-relaxed">
              {question.question}
            </h2>
          </div>

          <div className="space-y-3">
            {question.options.map((option, index) => {
              const isSelected = selectedAnswer === option
              const optionLetter = String.fromCharCode(65 + index)

              return (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 ${
                    isSelected
                      ? 'border-orange-500 bg-orange-50 shadow-md'
                      : 'border-gray-200 hover:border-orange-300 hover:bg-orange-50/50'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold flex-shrink-0 ${
                      isSelected
                        ? 'bg-orange-500 text-white'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {optionLetter}
                    </div>
                    <span className="text-gray-800 font-medium">{option}</span>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        <div className="flex items-center justify-between gap-4">
          <Button
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            variant="secondary"
            leftIcon={<ChevronLeft className="w-4 h-4" />}
          >
            Previous
          </Button>

          <div className="flex gap-2 overflow-x-auto">
            {quiz.questions.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentQuestion(index)}
                className={`w-10 h-10 rounded-lg font-medium transition-all flex-shrink-0 ${
                  index === currentQuestion
                    ? 'bg-orange-500 text-white'
                    : answers[index]
                    ? 'bg-green-100 text-green-700 border border-green-300'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>

          {currentQuestion === quiz.questions.length - 1 ? (
            <Button
              onClick={handleSubmit}
              isLoading={submitting}
              disabled={submitting}
              leftIcon={<Flag className="w-4 h-4" />}
            >
              Submit Quiz
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              rightIcon={<ChevronRight className="w-4 h-4" />}
            >
              Next
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

export default QuizTakePage

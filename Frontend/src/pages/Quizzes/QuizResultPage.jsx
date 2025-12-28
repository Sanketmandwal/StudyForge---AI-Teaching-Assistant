import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import quizService from '../../services/quizService'
import Spinner from '../../components/common/Spinner'
import toast from 'react-hot-toast'
import { 
  Trophy, 
  CheckCircle, 
  XCircle, 
  ChevronLeft, 
  Home,
  RotateCcw,
  TrendingUp,
  Award,
  Target,
  BookOpen
} from 'lucide-react'
import moment from 'moment'
import Button from '../../components/common/Button'

const QuizResultPage = () => {
 const { quizId } = useParams() 
  const navigate = useNavigate()
  
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showExplanations, setShowExplanations] = useState({})

  useEffect(() => {
    fetchResults()
  }, [quizId])

  const fetchResults = async () => {
    try {
      const response = await quizService.getQuizResults(quizId)
      setResults(response)
    } catch (error) {
      console.error('Fetch results error:', error)
      toast.error(error.message || "Failed to load results")
      navigate(-1)
    } finally {
      setLoading(false)
    }
  }

  const toggleExplanation = (index) => {
    setShowExplanations(prev => ({
      ...prev,
      [index]: !prev[index]
    }))
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner variant="dots" fullScreen={false} />
      </div>
    )
  }

  if (!results || !results.results) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Results Not Found</h2>
          <Button onClick={() => navigate(-1)}>Go Back</Button>
        </div>
      </div>
    )
  }

  const { data, results: questions } = results
  const correctCount = questions.filter(q => q.isCorrect).length
  const incorrectCount = questions.length - correctCount
  const accuracy = data.score || 0

  // Determine performance level
  let performanceLevel = 'Needs Improvement'
  let performanceColor = 'text-red-600'
  let performanceGradient = 'from-red-500 to-orange-600'
  
  if (accuracy >= 90) {
    performanceLevel = 'Excellent!'
    performanceColor = 'text-green-600'
    performanceGradient = 'from-green-500 to-emerald-600'
  } else if (accuracy >= 75) {
    performanceLevel = 'Great Job!'
    performanceColor = 'text-blue-600'
    performanceGradient = 'from-blue-500 to-cyan-600'
  } else if (accuracy >= 60) {
    performanceLevel = 'Good Effort'
    performanceColor = 'text-yellow-600'
    performanceGradient = 'from-yellow-500 to-orange-500'
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Back Button */}
        <Button
          onClick={() => navigate(-1)}
          leftIcon={<ChevronLeft className="w-4 h-4" />}
          variant="ghost"
          className="mb-6"
        >
          Back
        </Button>

        {/* Score Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 mb-8 overflow-hidden relative">
          {/* Background Decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-orange-100 to-red-100 rounded-full blur-3xl opacity-30 -mr-32 -mt-32"></div>
          
          <div className="relative">
            {/* Trophy Icon */}
            <div className={`w-20 h-20 bg-gradient-to-br ${performanceGradient} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg`}>
              <Trophy className="w-10 h-10 text-white" />
            </div>

            {/* Title */}
            <h1 className="text-3xl font-bold text-gray-900 text-center mb-2">
              {data.title || 'Quiz Results'}
            </h1>
            <p className="text-gray-600 text-center mb-8">
              Completed {moment(data.completedAt).format('MMM D, YYYY [at] h:mm A')}
            </p>

            {/* Score Circle */}
            <div className="flex justify-center mb-8">
              <div className="relative w-48 h-48">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="96"
                    cy="96"
                    r="88"
                    stroke="#E5E7EB"
                    strokeWidth="12"
                    fill="none"
                  />
                  <circle
                    cx="96"
                    cy="96"
                    r="88"
                    stroke="url(#gradient)"
                    strokeWidth="12"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 88}`}
                    strokeDashoffset={`${2 * Math.PI * 88 * (1 - accuracy / 100)}`}
                    strokeLinecap="round"
                    className="transition-all duration-1000"
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#F97316" />
                      <stop offset="100%" stopColor="#DC2626" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-5xl font-bold text-gray-900">{accuracy}%</span>
                  <span className={`text-sm font-medium ${performanceColor} mt-1`}>
                    {performanceLevel}
                  </span>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-6 mb-8">
              <div className="text-center p-4 bg-green-50 rounded-xl">
                <div className="flex items-center justify-center w-12 h-12 bg-green-500 rounded-lg mx-auto mb-2">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{correctCount}</p>
                <p className="text-sm text-gray-600">Correct</p>
              </div>

              <div className="text-center p-4 bg-red-50 rounded-xl">
                <div className="flex items-center justify-center w-12 h-12 bg-red-500 rounded-lg mx-auto mb-2">
                  <XCircle className="w-6 h-6 text-white" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{incorrectCount}</p>
                <p className="text-sm text-gray-600">Incorrect</p>
              </div>

              <div className="text-center p-4 bg-blue-50 rounded-xl">
                <div className="flex items-center justify-center w-12 h-12 bg-blue-500 rounded-lg mx-auto mb-2">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{data.totalQuestions}</p>
                <p className="text-sm text-gray-600">Total</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 justify-center">
              <Button
                onClick={() => navigate('/')}
                leftIcon={<Home className="w-4 h-4" />}
                variant="secondary"
              >
                Home
              </Button>
              <Button
                onClick={() => navigate(`/documents/${data.document}`)}
                leftIcon={<BookOpen className="w-4 h-4" />}
              >
                View Document
              </Button>
            </div>
          </div>
        </div>

        {/* Performance Insights */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="w-6 h-6 text-orange-600" />
            <h2 className="text-xl font-bold text-gray-900">Performance Insights</h2>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600">Accuracy Rate</span>
              <span className="font-bold text-gray-900">{accuracy}%</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600">Questions Answered</span>
              <span className="font-bold text-gray-900">{data.totalQuestions}/{data.totalQuestions}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600">Performance Level</span>
              <span className={`font-bold ${performanceColor}`}>{performanceLevel}</span>
            </div>
          </div>
        </div>

        {/* Detailed Results */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-6">
            <Award className="w-6 h-6 text-orange-600" />
            <h2 className="text-xl font-bold text-gray-900">Answer Review</h2>
          </div>

          <div className="space-y-4">
            {questions.map((question, index) => {
              const isCorrect = question.isCorrect
              const showExplanation = showExplanations[index]

              return (
                <div
                  key={index}
                  className={`border-2 rounded-xl p-5 transition-all ${
                    isCorrect 
                      ? 'border-green-200 bg-green-50/50' 
                      : 'border-red-200 bg-red-50/50'
                  }`}
                >
                  {/* Question Header */}
                  <div className="flex items-start gap-3 mb-4">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      isCorrect ? 'bg-green-500' : 'bg-red-500'
                    }`}>
                      {isCorrect ? (
                        <CheckCircle className="w-5 h-5 text-white" />
                      ) : (
                        <XCircle className="w-5 h-5 text-white" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 mb-1">
                        Question {index + 1}
                      </p>
                      <p className="text-gray-700 leading-relaxed">
                        {question.question}
                      </p>
                    </div>
                  </div>

                  {/* Options */}
                  <div className="space-y-2 mb-4 ml-11">
                    {question.options.map((option, optIndex) => {
                      const isSelectedAnswer = question.selectedAnswer === option
                      const isCorrectAnswer = question.correctAnswer === option
                      const optionLetter = String.fromCharCode(65 + optIndex)

                      let optionStyle = 'bg-white border-gray-200'
                      if (isCorrectAnswer) {
                        optionStyle = 'bg-green-100 border-green-500 font-medium'
                      } else if (isSelectedAnswer && !isCorrect) {
                        optionStyle = 'bg-red-100 border-red-500 font-medium'
                      }

                      return (
                        <div
                          key={optIndex}
                          className={`flex items-center gap-3 p-3 rounded-lg border-2 ${optionStyle}`}
                        >
                          <span className="w-6 h-6 rounded bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600">
                            {optionLetter}
                          </span>
                          <span className="text-sm text-gray-800">{option}</span>
                          {isCorrectAnswer && (
                            <CheckCircle className="w-4 h-4 text-green-600 ml-auto" />
                          )}
                          {isSelectedAnswer && !isCorrect && (
                            <XCircle className="w-4 h-4 text-red-600 ml-auto" />
                          )}
                        </div>
                      )
                    })}
                  </div>

                  {/* Your Answer vs Correct Answer */}
                  <div className="ml-11 space-y-2">
                    {question.selectedAnswer && (
                      <p className="text-sm">
                        <span className="font-medium text-gray-700">Your Answer: </span>
                        <span className={isCorrect ? 'text-green-600' : 'text-red-600'}>
                          {question.selectedAnswer}
                        </span>
                      </p>
                    )}
                    {!isCorrect && (
                      <p className="text-sm">
                        <span className="font-medium text-gray-700">Correct Answer: </span>
                        <span className="text-green-600">{question.correctAnswer}</span>
                      </p>
                    )}
                  </div>

                  {/* Explanation */}
                  {question.explanation && (
                    <div className="ml-11 mt-4">
                      <button
                        onClick={() => toggleExplanation(index)}
                        className="text-sm text-orange-600 hover:text-orange-700 font-medium flex items-center gap-1"
                      >
                        {showExplanation ? '▼' : '▶'} Explanation
                      </button>
                      {showExplanation && (
                        <div className="mt-2 p-3 bg-blue-50 border-l-4 border-blue-500 rounded text-sm text-gray-700">
                          {question.explanation}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="mt-8 flex justify-center gap-4">
          <Button
            onClick={() => navigate(-1)}
            leftIcon={<ChevronLeft className="w-4 h-4" />}
            variant="secondary"
            size="lg"
          >
            Back to Quizzes
          </Button>
          <Button
            onClick={() => navigate('/')}
            leftIcon={<Home className="w-4 h-4" />}
            size="lg"
          >
            Home
          </Button>
        </div>
      </div>
    </div>
  )
}

export default QuizResultPage

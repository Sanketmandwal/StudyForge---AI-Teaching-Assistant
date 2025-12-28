import React from 'react'
import moment from 'moment'
import Button from '../common/Button'
import { Clock, Trophy, CheckCircle, Play, Trash2, ClipboardList } from 'lucide-react'

const QuizCard = ({ quiz, onTakeQuiz, onViewResults, onDelete }) => {
  
  const isCompleted = Boolean(
    quiz.completedAt &&
    quiz.userAnswers &&
    quiz.userAnswers.length > 0 &&
    quiz.score !== null &&
    quiz.score !== undefined
  )
  const correctAnswers = quiz.userAnswers?.filter(a => a.isCorrect).length || 0

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-orange-200 group">
    
      <div className="flex items-start justify-between mb-4">
        <div className={`w-14 h-14 bg-gradient-to-br ${isCompleted
            ? 'from-green-500 to-emerald-600'
            : 'from-orange-500 to-red-600'
          } rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
          {isCompleted ? (
            <Trophy className="w-7 h-7 text-white" />
          ) : (
            <ClipboardList className="w-7 h-7 text-white" />
          )}
        </div>

        {isCompleted && (
          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium flex items-center gap-1">
            <CheckCircle className="w-3 h-3" />
            Completed
          </span>
        )}
      </div>

      <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-orange-600 transition-colors">
        {quiz.title || 'Untitled Quiz'}
      </h3>

      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <ClipboardList className="w-4 h-4" />
          <span>{quiz.totalQuestions || quiz.questions?.length || 0} questions</span>
        </div>

        {isCompleted && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Trophy className="w-4 h-4 text-yellow-500" />
            <span className="font-medium text-gray-900">
              Score: {quiz.score}% ({correctAnswers}/{quiz.totalQuestions})
            </span>
          </div>
        )}

        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Clock className="w-3 h-3" />
          <span>
            {isCompleted
              ? `Completed ${moment(quiz.completedAt).fromNow()}`
              : `Created ${moment(quiz.createdAt).fromNow()}`
            }
          </span>
        </div>
      </div>

      <div className="flex gap-2">
        {isCompleted ? (
          <Button
            onClick={() => onViewResults(quiz._id)}
            size="sm"
            fullWidth
            variant="outline"
            leftIcon={<Trophy className="w-4 h-4" />}
          >
            View Results
          </Button>
        ) : (
          <Button
            onClick={() => onTakeQuiz(quiz._id)}
            size="sm"
            fullWidth
            leftIcon={<Play className="w-4 h-4" />}
          >
            Take Quiz
          </Button>
        )}
        <button
          onClick={() => onDelete(quiz)}
          className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

export default QuizCard

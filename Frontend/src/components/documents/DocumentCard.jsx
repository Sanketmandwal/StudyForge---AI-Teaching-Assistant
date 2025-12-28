import React from 'react'
import { useNavigate } from 'react-router-dom'
import moment from 'moment'
import { FileText, Trash2, Eye, Calendar, HardDrive, CreditCard, ClipboardCheck } from 'lucide-react'

const formatFileSize = (bytes) => {
  if (!bytes || bytes === 0) return 'N/A'

  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  let size = bytes
  let unitIndex = 0

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024
    unitIndex++
  }

  return `${size.toFixed(2)} ${units[unitIndex]}`
}

const DocumentCard = ({ document, onDelete }) => {
  const navigate = useNavigate()

  const handleNavigate = () => {
    navigate(`/documents/${document._id}`)
  }

  const handleDelete = (e) => {
    e.stopPropagation()
    onDelete(document)
  }

  const getFileExtension = () => {
    if (!document.filename) return 'DOC'
    const ext = document.filename.split('.').pop().toUpperCase()
    return ext || 'DOC'
  }

  const fileExtension = getFileExtension()

  const getFileTypeColor = () => {
    if (fileExtension === 'PDF') return 'from-red-500 to-orange-500'
    if (fileExtension === 'DOC' || fileExtension === 'DOCX') return 'from-blue-500 to-cyan-500'
    if (fileExtension === 'TXT') return 'from-gray-500 to-gray-600'
    return 'from-purple-500 to-pink-500'
  }

  return (
    <div
      className="group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-gray-200 cursor-pointer"
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${getFileTypeColor()} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300`}></div>

      <div className="relative">
        <div className="flex items-start justify-between mb-4">
          <div className={`w-14 h-14 bg-gradient-to-br ${getFileTypeColor()} rounded-xl flex items-center justify-center shadow-lg`}>
            <FileText className="w-7 h-7 text-white" />
          </div>
          <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-semibold rounded-lg">
            {fileExtension}
          </span>
        </div>
        <h3 
          onClick={handleNavigate}
          className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors"
        >
          {document.title || 'Untitled Document'}
        </h3>

        {(document.flashcardCount !== undefined || document.quizCount !== undefined) && (
          <div className="flex items-center gap-3 mb-4">
            {document.flashcardCount !== undefined && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 rounded-lg">
                <CreditCard className="w-3.5 h-3.5 text-purple-600" />
                <span className="text-xs font-semibold text-purple-700">
                  {document.flashcardCount} Cards
                </span>
              </div>
            )}
            {document.quizCount !== undefined && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 rounded-lg">
                <ClipboardCheck className="w-3.5 h-3.5 text-orange-600" />
                <span className="text-xs font-semibold text-orange-700">
                  {document.quizCount} Quizzes
                </span>
              </div>
            )}
          </div>
        )}

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Calendar className="w-4 h-4" />
            <span>
              {document.uploadedAt 
                ? moment(document.uploadedAt).format('MMM DD, YYYY')
                : moment(document.createdAt).format('MMM DD, YYYY')
              }
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <HardDrive className="w-4 h-4" />
            <span>{formatFileSize(document.fileSize)}</span>
          </div>
        </div>

        <div className="border-t border-gray-100 my-4"></div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleNavigate}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg"
          >
            <Eye className="w-4 h-4" />
            <span>View</span>
          </button>
          <button
            onClick={handleDelete}
            className="p-2.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors"
            title="Delete document"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    </div>
  )
}

export default DocumentCard

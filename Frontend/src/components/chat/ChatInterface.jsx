import React, { useEffect, useState, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Spinner from '../common/Spinner'
import Button from '../common/Button'
import aiService from '../../services/aiService'
import MarkdownRenderer from '../common/MarkDownRenderer.jsx'
import { MessageSquare, Send, User, Sparkles, AlertCircle } from 'lucide-react'
import moment from 'moment'

const ChatInterface = () => {
  const { id } = useParams()
  const { user } = useAuth()
  const [history, setHistory] = useState([])
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        setInitialLoading(true)
        const response = await aiService.getChatHistory(id)
        setHistory(response.data || [])
      } catch (error) {
        console.error("Error Fetching Chat History:", error)
        setHistory([])
      } finally {
        setInitialLoading(false)
      }
    }
    fetchChatHistory()
  }, [id])

  useEffect(() => {
    scrollToBottom()
  }, [history])

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!message.trim()) return

    const userMessage = { role: "user", content: message, timestamp: new Date() }
    setHistory((prev) => [...prev, userMessage])
    setMessage("")
    setLoading(true)

    try {
      const response = await aiService.chat(id, userMessage.content)
      const assistantMessage = {
        role: "assistant",
        content: response.data.answer,
        timestamp: new Date(),
        relevantChunks: response.data.relevantChunks
      }
      setHistory(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error("Error sending message:", error)
      const errorMessage = {
        role: "assistant",
        content: "Sorry, I encountered an error. Please try again later.",
        timestamp: new Date(),
        isError: true
      }
      setHistory(prev => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  const renderMessage = (msg, index) => {
    const isUser = msg.role === "user"
    const isError = msg.isError

    return (
      <div
        key={index}
        className={`flex gap-3 mb-6 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
      >
        
        <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
          isUser 
            ? 'bg-gradient-to-br from-blue-500 to-purple-600' 
            : isError 
            ? 'bg-red-100'
            : 'bg-gradient-to-br from-purple-500 to-pink-600'
        }`}>
          {isUser ? (
            <span className="text-white font-semibold text-sm">
              {user?.username?.charAt(0).toUpperCase() || 'U'}
            </span>
          ) : isError ? (
            <AlertCircle className="w-5 h-5 text-red-600" />
          ) : (
            <Sparkles className="w-5 h-5 text-white" />
          )}
        </div>

        
        <div className={`flex flex-col max-w-[70%] ${isUser ? 'items-end' : 'items-start'}`}>
          {/* Sender Name */}
          <span className="text-xs font-medium text-gray-500 mb-1 px-2">
            {isUser ? 'You' : 'AI Assistant'}
          </span>

        
          <div
            className={`rounded-2xl px-4 py-3 ${
              isUser
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-tr-sm'
                : isError
                ? 'bg-red-50 text-red-900 border border-red-200 rounded-tl-sm'
                : 'bg-gray-100 text-gray-900 rounded-tl-sm'
            }`}
          >
            {isUser ? (
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
            ) : (
              <MarkdownRenderer content={msg.content} />
            )}
          </div>

         
          <span className="text-xs text-gray-400 mt-1 px-2">
            {msg.timestamp ? moment(msg.timestamp).format('h:mm A') : 'Just now'}
          </span>

       
          {msg.relevantChunks && msg.relevantChunks.length > 0 && (
            <div className="mt-2 text-xs text-gray-500 px-2">
              <span className="font-medium">Sources: </span>
              {msg.relevantChunks.length} reference{msg.relevantChunks.length > 1 ? 's' : ''}
            </div>
          )}
        </div>
      </div>
    )
  }

  if (initialLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-50 to-purple-50 rounded-full flex items-center justify-center mb-4">
          <MessageSquare className="w-8 h-8 text-blue-600 animate-pulse" />
        </div>
        <Spinner variant="dots" fullScreen={false} />
        <p className="text-gray-600 mt-4">Loading chat history...</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-[600px] bg-white rounded-2xl border border-gray-200 overflow-hidden">
   
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-gray-50/50 to-white">
        {history.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-50 to-purple-50 rounded-full flex items-center justify-center mb-6">
              <MessageSquare className="w-10 h-10 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Start a Conversation
            </h3>
            <p className="text-gray-600 max-w-md mb-6">
              Ask me anything about your document. I can help explain concepts, summarize sections, or answer specific questions.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-2xl">
              <button
                onClick={() => setMessage("Can you summarize this document?")}
                className="p-4 bg-white border border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all text-left group"
              >
                <p className="font-medium text-gray-900 group-hover:text-blue-600 mb-1">
                  Summarize document
                </p>
                <p className="text-xs text-gray-500">Get a quick overview</p>
              </button>
              <button
                onClick={() => setMessage("What are the key points?")}
                className="p-4 bg-white border border-gray-200 rounded-xl hover:border-purple-300 hover:bg-purple-50 transition-all text-left group"
              >
                <p className="font-medium text-gray-900 group-hover:text-purple-600 mb-1">
                  Key points
                </p>
                <p className="text-xs text-gray-500">Extract main ideas</p>
              </button>
              <button
                onClick={() => setMessage("Explain this topic in simple terms")}
                className="p-4 bg-white border border-gray-200 rounded-xl hover:border-green-300 hover:bg-green-50 transition-all text-left group"
              >
                <p className="font-medium text-gray-900 group-hover:text-green-600 mb-1">
                  Simplify concepts
                </p>
                <p className="text-xs text-gray-500">Easy explanations</p>
              </button>
              <button
                onClick={() => setMessage("Create study questions")}
                className="p-4 bg-white border border-gray-200 rounded-xl hover:border-orange-300 hover:bg-orange-50 transition-all text-left group"
              >
                <p className="font-medium text-gray-900 group-hover:text-orange-600 mb-1">
                  Study questions
                </p>
                <p className="text-xs text-gray-500">Test your knowledge</p>
              </button>
            </div>
          </div>
        ) : (
          <>
            {history.map(renderMessage)}
            {loading && (
              <div className="flex gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div className="bg-gray-100 rounded-2xl rounded-tl-sm px-4 py-3">
                  <div className="flex gap-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      <div className="border-t border-gray-200 p-4 bg-white">
        <form onSubmit={handleSendMessage} className="flex gap-3">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ask a question about your document..."
            disabled={loading}
            className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-blue-500 focus:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <Button
            type="submit"
            disabled={loading || !message.trim()}
            leftIcon={<Send className="w-4 h-4" />}
            size="md"
          >
            Send
          </Button>
        </form>
      </div>
    </div>
  )
}

export default ChatInterface

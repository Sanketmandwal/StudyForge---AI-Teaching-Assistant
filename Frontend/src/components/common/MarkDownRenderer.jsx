import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'

const MarkdownRenderer = ({ content }) => {
  return (
    <div className="prose prose-sm max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Headings
          h1: ({ node, ...props }) => (
            <h1 className="text-2xl font-bold text-gray-900 mt-6 mb-4" {...props} />
          ),
          h2: ({ node, ...props }) => (
            <h2 className="text-xl font-bold text-gray-900 mt-5 mb-3" {...props} />
          ),
          h3: ({ node, ...props }) => (
            <h3 className="text-lg font-semibold text-gray-900 mt-4 mb-2" {...props} />
          ),
          
          // Paragraphs
          p: ({ node, ...props }) => (
            <p className="text-gray-700 leading-relaxed mb-4" {...props} />
          ),
          
          // Lists
          ul: ({ node, ...props }) => (
            <ul className="list-disc list-inside mb-4 space-y-2 text-gray-700" {...props} />
          ),
          ol: ({ node, ...props }) => (
            <ol className="list-decimal list-inside mb-4 space-y-2 text-gray-700" {...props} />
          ),
          li: ({ node, ...props }) => (
            <li className="ml-4" {...props} />
          ),
          
          // Links
          a: ({ node, ...props }) => (
            <a
              className="text-blue-600 hover:text-blue-700 underline font-medium"
              target="_blank"
              rel="noopener noreferrer"
              {...props}
            />
          ),
          
          // Code blocks
          code: ({ node, inline, className, children, ...props }) => {
            const match = /language-(\w+)/.exec(className || '')
            return !inline && match ? (
              <SyntaxHighlighter
                style={vscDarkPlus}
                language={match[1]}
                PreTag="div"
                className="rounded-lg my-4"
                {...props}
              >
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            ) : (
              <code
                className="bg-gray-100 text-red-600 px-1.5 py-0.5 rounded text-sm font-mono"
                {...props}
              >
                {children}
              </code>
            )
          },
          
          // Blockquotes
          blockquote: ({ node, ...props }) => (
            <blockquote
              className="border-l-4 border-blue-500 pl-4 py-2 my-4 bg-blue-50 text-gray-700 italic"
              {...props}
            />
          ),
          
          // Tables
          table: ({ node, ...props }) => (
            <div className="overflow-x-auto my-4">
              <table className="min-w-full border border-gray-300" {...props} />
            </div>
          ),
          thead: ({ node, ...props }) => (
            <thead className="bg-gray-100" {...props} />
          ),
          th: ({ node, ...props }) => (
            <th className="border border-gray-300 px-4 py-2 text-left font-semibold text-gray-900" {...props} />
          ),
          td: ({ node, ...props }) => (
            <td className="border border-gray-300 px-4 py-2 text-gray-700" {...props} />
          ),
          
          // Horizontal rule
          hr: ({ node, ...props }) => (
            <hr className="my-6 border-gray-300" {...props} />
          ),
          
          // Strong/Bold
          strong: ({ node, ...props }) => (
            <strong className="font-bold text-gray-900" {...props} />
          ),
          
          // Emphasis/Italic
          em: ({ node, ...props }) => (
            <em className="italic text-gray-800" {...props} />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}

export default MarkdownRenderer

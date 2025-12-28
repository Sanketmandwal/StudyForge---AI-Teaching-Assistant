import React from 'react'
import { Loader2, Sparkles } from 'lucide-react'

const Spinner = ({ 
  size = 'default', 
  variant = 'gradient',
  fullScreen = true,
  text = 'Loading...' 
}) => {
  
  const sizes = {
    small: 'w-8 h-8',
    default: 'w-12 h-12',
    large: 'w-16 h-16'
  }

  // Gradient spinner with dual rotating rings
  if (variant === 'gradient') {
    return (
      <div className={`${fullScreen ? 'fixed inset-0 bg-white/80 backdrop-blur-sm' : ''} flex items-center justify-center z-50`}>
        <div className="text-center">
          <div className="relative inline-flex items-center justify-center">
            {/* Outer ring */}
            <div className={`${sizes[size]} border-4 border-gray-200 rounded-full`}></div>
            
            {/* Animated gradient ring */}
            <div className={`absolute ${sizes[size]} border-4 border-transparent rounded-full animate-spin`}
              style={{
                borderTopColor: '#3b82f6',
                borderRightColor: '#8b5cf6',
                animationDuration: '1s'
              }}
            ></div>
            
            {/* Inner glow effect */}
            <div className="absolute inset-0 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-blue-600 animate-pulse" />
            </div>
          </div>
          
          {text && (
            <p className="mt-4 text-sm font-medium text-gray-600 animate-pulse">
              {text}
            </p>
          )}
        </div>
      </div>
    )
  }

  // Dots spinner
  if (variant === 'dots') {
    return (
      <div className={`${fullScreen ? 'fixed inset-0 bg-white/80 backdrop-blur-sm' : ''} flex items-center justify-center z-50`}>
        <div className="text-center">
          <div className="flex gap-2">
            <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-3 h-3 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-3 h-3 bg-pink-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
          {text && (
            <p className="mt-4 text-sm font-medium text-gray-600">
              {text}
            </p>
          )}
        </div>
      </div>
    )
  }

  // Pulse spinner
  if (variant === 'pulse') {
    return (
      <div className={`${fullScreen ? 'fixed inset-0 bg-white/80 backdrop-blur-sm' : ''} flex items-center justify-center z-50`}>
        <div className="text-center">
          <div className="relative inline-flex items-center justify-center">
            {/* Pulsing rings */}
            <div className="absolute w-16 h-16 bg-blue-400 rounded-full animate-ping opacity-20"></div>
            <div className="absolute w-12 h-12 bg-purple-400 rounded-full animate-ping opacity-30" style={{ animationDelay: '0.5s' }}></div>
            <div className="relative w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white animate-pulse" />
            </div>
          </div>
          {text && (
            <p className="mt-6 text-sm font-medium text-gray-600">
              {text}
            </p>
          )}
        </div>
      </div>
    )
  }

  // Bars spinner
  if (variant === 'bars') {
    return (
      <div className={`${fullScreen ? 'fixed inset-0 bg-white/80 backdrop-blur-sm' : ''} flex items-center justify-center z-50`}>
        <div className="text-center">
          <div className="flex gap-1.5 items-end h-12">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="w-2 bg-gradient-to-t from-blue-600 to-purple-600 rounded-full animate-pulse"
                style={{
                  animationDelay: `${i * 0.15}s`,
                  height: '100%',
                  animationDuration: '1s'
                }}
              ></div>
            ))}
          </div>
          {text && (
            <p className="mt-4 text-sm font-medium text-gray-600">
              {text}
            </p>
          )}
        </div>
      </div>
    )
  }

  // Default: Icon spinner (lucide-react)
  return (
    <div className={`${fullScreen ? 'fixed inset-0 bg-white/80 backdrop-blur-sm' : ''} flex items-center justify-center z-50`}>
      <div className="text-center">
        <div className="relative inline-block">
          <Loader2 className={`${sizes[size]} text-blue-600 animate-spin`} />
          <div className="absolute inset-0 blur-xl opacity-30">
            <Loader2 className={`${sizes[size]} text-purple-600 animate-spin`} />
          </div>
        </div>
        {text && (
          <p className="mt-4 text-sm font-medium text-gray-600 animate-pulse">
            {text}
          </p>
        )}
      </div>
    </div>
  )
}

export default Spinner

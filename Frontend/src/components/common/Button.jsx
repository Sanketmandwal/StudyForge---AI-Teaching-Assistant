import React from 'react'
import { Loader2 } from 'lucide-react'

const Button = ({
  children,
  onClick,
  type = 'button',
  disabled = false,
  className = '',
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  ...props
}) => {
  
  // Base styles
  const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed'
  
  // Variant styles
  const variants = {
    primary: 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 focus:ring-blue-500 shadow-lg shadow-blue-200 hover:shadow-xl hover:shadow-blue-300',
    secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500 border border-gray-200 hover:border-gray-300',
    success: 'bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700 focus:ring-green-500 shadow-lg shadow-green-200 hover:shadow-xl hover:shadow-green-300',
    danger: 'bg-gradient-to-r from-red-600 to-pink-600 text-white hover:from-red-700 hover:to-pink-700 focus:ring-red-500 shadow-lg shadow-red-200 hover:shadow-xl hover:shadow-red-300',
    warning: 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white hover:from-yellow-600 hover:to-orange-600 focus:ring-yellow-500 shadow-lg shadow-yellow-200 hover:shadow-xl hover:shadow-yellow-300',
    outline: 'bg-transparent border-2 border-blue-600 text-blue-600 hover:bg-blue-50 focus:ring-blue-500',
    ghost: 'bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-500',
    link: 'bg-transparent text-blue-600 hover:text-blue-700 hover:underline focus:ring-blue-500 p-0'
  }
  
  // Size styles
  const sizes = {
    xs: 'text-xs px-3 py-1.5 gap-1.5',
    sm: 'text-sm px-4 py-2 gap-2',
    md: 'text-sm px-5 py-2.5 gap-2',
    lg: 'text-base px-6 py-3 gap-2.5',
    xl: 'text-lg px-8 py-4 gap-3'
  }
  
  // Combine classes
  const buttonClasses = `
    ${baseStyles}
    ${variants[variant]}
    ${sizes[size]}
    ${fullWidth ? 'w-full' : ''}
    ${className}
  `.trim().replace(/\s+/g, ' ')
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={buttonClasses}
      {...props}
    >
      {/* Loading spinner */}
      {isLoading && (
        <Loader2 className="w-4 h-4 animate-spin" />
      )}
      
      {/* Left icon */}
      {!isLoading && leftIcon && (
        <span className="inline-flex items-center">
          {leftIcon}
        </span>
      )}
      
      {/* Button text */}
      <span>{children}</span>
      
      {/* Right icon */}
      {!isLoading && rightIcon && (
        <span className="inline-flex items-center">
          {rightIcon}
        </span>
      )}
    </button>
  )
}

export default Button

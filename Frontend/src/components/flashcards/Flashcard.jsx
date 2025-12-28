import React, { useState, useEffect } from 'react'
import { Star } from 'lucide-react'

const Flashcard = ({ flashcard, onToggleStar, showStarButton = true }) => {
  const [isFlipped, setIsFlipped] = useState(false)

  useEffect(() => {
    setIsFlipped(false)
  }, [flashcard._id])

  const handleFlip = () => {
    setIsFlipped(!isFlipped)
  }

  const handleStarClick = (e) => {
    e.stopPropagation()
    onToggleStar(flashcard._id)
  }

  return (
    <div 
      className="perspective-1000 w-full h-80 cursor-pointer"
      onClick={handleFlip}
    >
      <div 
        className={`relative w-full h-full transition-transform duration-700 transform-style-3d ${
          isFlipped ? 'rotate-y-180' : ''
        }`}
      >
        <div className="absolute inset-0 backface-hidden">
          <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-2xl p-8 flex flex-col">
            {/* Star Button */}
            {showStarButton && (
              <div className="flex justify-end mb-4">
                <button
                  onClick={handleStarClick}
                  className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                >
                  <Star 
                    className={`w-5 h-5 ${
                      flashcard.isStarred ? 'fill-yellow-400 text-yellow-400' : 'text-white'
                    }`}
                  />
                </button>
              </div>
            )}

          
            <div className="flex-1 flex items-center justify-center text-center">
              <p className="text-2xl font-bold text-white leading-relaxed">
                {flashcard.question}
              </p>
            </div>

         
            <div className="text-center">
              <p className="text-white/80 text-sm">Click to reveal answer</p>
            </div>
          </div>
        </div>

        <div className="absolute inset-0 backface-hidden rotate-y-180">
          <div className="w-full h-full bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-2xl p-8 flex flex-col">
          
            {showStarButton && (
              <div className="flex justify-end mb-4">
                <button
                  onClick={handleStarClick}
                  className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                >
                  <Star 
                    className={`w-5 h-5 ${
                      flashcard.isStarred ? 'fill-yellow-400 text-yellow-400' : 'text-white'
                    }`}
                  />
                </button>
              </div>
            )}

           
            <div className="flex-1 flex items-center justify-center text-center">
              <p className="text-xl font-semibold text-white leading-relaxed">
                {flashcard.answer}
              </p>
            </div>

       
            <div className="text-center">
              <p className="text-white/80 text-sm">Click to see question</p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .transform-style-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>
    </div>
  )
}

export default Flashcard

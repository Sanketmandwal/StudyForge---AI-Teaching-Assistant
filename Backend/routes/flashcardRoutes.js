import express from 'express'
import {
    getFlashcards,
    getAllFlashcardSets,
    reviewFlashcard,
    toggleStarFlashcard,
    deleteFlashcardSet,
} from '../controllers/flashcardController.js'
import protect from '../middleware/auth.js'

const FlashcardRouter = express.Router();

FlashcardRouter.use(protect);

FlashcardRouter.get('/',getAllFlashcardSets);
FlashcardRouter.get('/:documentId',getFlashcards)
FlashcardRouter.post('/:cardId/review',reviewFlashcard)
FlashcardRouter.put('/:cardId/star' , toggleStarFlashcard)
FlashcardRouter.delete('/:id', deleteFlashcardSet)



export default FlashcardRouter;
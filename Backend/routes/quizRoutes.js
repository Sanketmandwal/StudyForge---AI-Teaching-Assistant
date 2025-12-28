import express from 'express'
import {
    getQuizzes,
    getQuizById ,
    submitQuiz,
    getQuizResults,
    deleteQuiz,
} from '../controllers/quizController.js'
import protect from '../middleware/auth.js'


const quizRouter = express.Router()

quizRouter.use(protect)

quizRouter.get('/:documentId' , getQuizzes)
quizRouter.get('/quiz/:id' , getQuizById)
quizRouter.post('/submit/:id' , submitQuiz)
quizRouter.get('/:id/results', getQuizResults)
quizRouter.delete('/:id', deleteQuiz)

export default quizRouter
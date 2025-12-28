import { count } from 'console'
import Quiz from '../models/Quiz.js'
import { title } from 'process'


export const getQuizzes = async (req, res, next) => {
    try {
        const quizzes = await Quiz.find({
            userId: req.user._id,
            documentId: req.params.documentId
        }).populate('documentId', 'title fileName').sort({ createdAt: -1 })

        res.status(200).json({
            success: true,
            data: quizzes,
            count: quizzes.length
        })
    } catch (error) {
        next(error)
    }
}


export const getQuizById = async (req, res, next) => {
    try {
        const quiz = await Quiz.findOne({
            userId: req.user._id,
            _id: req.params.id
        })

        if (!quiz) {
            return res.status(404).json({
                success: false,
                error: "Quiz NOT FOUND",
                statusCode: 404
            })
        }

        res.status(200).json({
            success: true,
            data: quiz
        })
    } catch (error) {
        next(error)
    }
}


export const submitQuiz = async (req, res, next) => {
    try {
        const { answers } = req.body

        if (!Array.isArray(answers) || answers.length === 0) {
            return res.status(400).json({
                success: false,
                error: "Answers are required and should be an array",
                statusCode: 400
            })
        }

        const quiz = await Quiz.findOne({
            userId: req.user._id,
            _id: req.params.id
        })

        if (!quiz) {
            return res.status(404).json({
                success: false,
                error: "Quiz NOT FOUND",
                statusCode: 404
            })
        }

        if (quiz.completedAt) {
            return res.status(400).json({
                success: false,
                error: "Quiz has already been submitted",
                statusCode: 400
            })
        }

        let correctCount = 0;
        const userAnswers = []

        answers.forEach((answer) => {
            const { questionIndex, selectedAnswer } = answer

            if (questionIndex < quiz.questions.length) {
                const question = quiz.questions[questionIndex]
                const isCorrect = question.correctAnswer === selectedAnswer

                if (isCorrect) {
                    correctCount++
                }

                userAnswers.push({
                    questionIndex,
                    selectedAnswer,
                    isCorrect,
                    answeredAt: new Date()
                })
            }
        })

        const score = Math.round(correctCount / quiz.totalQuestions * 100)

        quiz.userAnswers = userAnswers
        quiz.score = score
        quiz.completedAt = new Date()

        await quiz.save()

        res.status(200).json({
            success: true,
            data: {
                quizId: quiz._id,
                score,
                correctCount,
                totalQuestions: quiz.totalQuestions,
                percentage: score,
                userAnswers,
            },
            message: "Quiz submitted successfully"
        })

    } catch (error) {
        next(error)
    }
}


export const getQuizResults = async (req, res, next) => {
    try {
        const quiz = await Quiz.findOne({
            userId: req.user._id,
            _id: req.params.id
        })

        if (!quiz) {
            return res.status(404).json({
                success: false,
                error: "Quiz NOT FOUND",
                statusCode: 404
            })
        }

        if (!quiz.completedAt) {
            return res.status(400).json({
                success: false,
                error: "Quiz has not been submitted yet",
                statusCode: 400
            })
        }

        const detailedResults = quiz.questions.map((question, index) => {
            const userAnswer = quiz.userAnswers.find(ans => ans.questionIndex === index)
            return {
                questionIndex: index,
                question: question.question,
                options: question.options,
                correctAnswer: question.correctAnswer,
                selectedAnswer: userAnswer ? userAnswer.selectedAnswer : null,
                isCorrect: userAnswer ? userAnswer.isCorrect : false,
                explanation: question.explanation
            }
        }
        )

        res.status(200).json({
            success: true,
            data: {
                id: quiz._id,
                title: quiz.title,
                document: quiz.documentId,
                score: quiz.score,
                totalQuestions: quiz.totalQuestions,
                completedAt: quiz.completedAt,

            },
            results: detailedResults,
            message: "Quiz results fetched successfully"
        })

    } catch (error) {
        next(error)
    }
}


export const deleteQuiz = async (req, res, next) => {
    try {
        const quiz = await Quiz.findOne({
            _id: req.params.id,
            userId: req.user._id
        })

        if (!quiz) {
            return res.status(404).json({
                success: false,
                error: "Quiz NOT FOUND",
                statusCode: 404
            })
        }

        await quiz.deleteOne()

        res.status(200).json({
            success: true,
            message: "Quiz deleted successfully"
        })
    } catch (error) {
        next(error)
    }
}
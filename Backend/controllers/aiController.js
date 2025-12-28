import Flashcard from "../models/Flashcard.js";
import Document from "../models/Document.js";
import Quiz from "../models/Quiz.js";
import ChatHistory from "../models/ChatHistory.js";
import * as geminiService from "../utils/geminiService.js";
import { findRelevantChunks } from "../utils/textChunker.js";

/* ---------------- FLASHCARDS (already done, kept as-is) ---------------- */

export const generateFlashcards = async (req, res, next) => {
    try {
        const { documentId, count = 10 } = req.body;

        if (!documentId) {
            return res.status(400).json({
                success: false,
                error: "Please Provide documentId"
            });
        }

        const document = await Document.findOne({
            _id: documentId,
            userId: req.user._id,
            status: "ready"
        });

        if (!document) {
            return res.status(404).json({
                success: false,
                error: "Document Not Found or Not Ready"
            });
        }

        const cards = await geminiService.generateFlashcards(
            document.extractedText,
            parseInt(count)
        );

        // console.log("Cards", cards)

        const flashcardSet = await Flashcard.create({
            userId: req.user._id,
            documentId: document._id,
            cards: cards.map(card => ({
                question: card.question,
                answer: card.answer,
                difficulty: card.difficulty,
                reviewCount: 0,
                isStarred: false
            }))
        });

        // console.log(flashcardSet)

        res.status(200).json({
            success: true,
            data: flashcardSet,
            message: "Flashcards generated successfully"
        });
    } catch (error) {
        next(error);
    }
};

/* ---------------- QUIZ GENERATION ---------------- */

export const generateQuiz = async (req, res, next) => {
    try {
        const { documentId, numQuestions = 5, title = "Quiz" } = req.body;

        if (!documentId) {
            return res.status(400).json({
                success: false,
                error: "Please Provide documentId"
            });
        }

        const document = await Document.findOne({
            _id: documentId,
            userId: req.user._id,
            status: "ready"
        });

        if (!document) {
            return res.status(404).json({
                success: false,
                error: "Document Not Found or Not Ready"
            });
        }

        const questions = await geminiService.generateQuiz(
            document.extractedText,
            parseInt(numQuestions)
        );

        const quiz = await Quiz.create({
            userId: req.user._id,
            documentId: document._id,
            title,
            questions,
            totalQuestions: questions.length,
            userAnswers: [],
            score: 0
        });

        res.status(200).json({
            success: true,
            data: quiz,
            message: "Quiz generated successfully"
        });
    } catch (error) {
        next(error);
    }
};

/* ---------------- SUMMARY GENERATION ---------------- */

export const generateSummary = async (req, res, next) => {
    try {
        const { documentId } = req.body;

        if (!documentId) {
            return res.status(400).json({
                success: false,
                error: "Please Provide documentId"
            });
        }

        const document = await Document.findOne({
            _id: documentId,
            userId: req.user._id,
            status: "ready"
        });

        if (!document) {
            return res.status(404).json({
                success: false,
                error: "Document Not Found or Not Ready"
            });
        }

        const summary = await geminiService.generateSummary(
            document.extractedText
        );

        res.status(200).json({
            success: true,
            data: {
                documentId: document._id,
                title: document._id,
                summary
            },
            message: "Summary generated successfully"
        });
    } catch (error) {
        next(error);
    }
};

/* ---------------- DOCUMENT-BASED CHAT (RAG) ---------------- */

export const chat = async (req, res, next) => {
    try {
        const { documentId, question } = req.body;

        if (!documentId || !question) {
            return res.status(400).json({
                success: false,
                error: "documentId and question are required"
            });
        }

        const document = await Document.findOne({
            _id: documentId,
            userId: req.user._id,
            status: "ready"
        });

        if (!document) {
            return res.status(404).json({
                success: false,
                error: "Document Not Found or Not Ready"
            });
        }

        // 🔥 RAG STEP: retrieve relevant chunks
        const relevantChunks = findRelevantChunks(
            document.chunks,
            question,
            3
        );
        const chunkIndices = relevantChunks.map(c => c.chunkIndex)

        let chatHistory = await ChatHistory.findOne({
            userId: req.user._id,
            documentId: document._id
        })

        if (!chatHistory) {
            chatHistory = await ChatHistory.create({
                userId: req.user._id,
                documentId: document._id,
                messages: []
            });
        }


        const answer = await geminiService.chatWithContext(
            question,
            relevantChunks
        );

        chatHistory.messages.push(
            {
                role: 'user',
                content: question,
                timestamp: new Date(),
                relevantChunks: []
            },
            {
                role: 'assistant',
                content: answer,
                timestamp: new Date(),
                relevantChunks: chunkIndices
            }
        )

        await chatHistory.save()


        res.status(200).json({
            success: true,
            data: {
                answer,
                question,
                relevantChunks: chunkIndices,
                chatHistoryId: chatHistory._id
            },
            message: 'Response Generated Successfully'
        });
    } catch (error) {
        next(error);
    }
};

/* ---------------- EXPLAIN CONCEPT ---------------- */

export const explainConcept = async (req, res, next) => {
    try {
        const { documentId, concept } = req.body;

        if (!documentId || !concept) {
            return res.status(400).json({
                success: false,
                error: "documentId and concept are required"
            });
        }

        const document = await Document.findOne({
            _id: documentId,
            userId: req.user._id,
            status: "ready"
        });

        if (!document) {
            return res.status(404).json({
                success: false,
                error: "Document Not Found or Not Ready"
            });
        }

        const relevantChunks = findRelevantChunks(document.chunks, concept, 3)
        const context = relevantChunks.map(c => c.content).join('\n\n')

        const explanation = await geminiService.explainConcept(
            concept,
            context
        );

        res.status(200).json({
            success: true,
            data: { concept , explanation ,
                relevantChunks : relevantChunks.map(c => c.chunkIndex)
            },
            message : 'Explantion Generated Successfully'
        });
    } catch (error) {
        next(error);
    }
};

/* ---------------- CHAT HISTORY ---------------- */

export const getChatHistory = async (req, res, next) => {
    try {
        const { documentId } = req.params;

        if (!documentId) {
            return res.status(400).json({
                success: false,
                error: "documentId is required"
            });
        }

        const chatHistory = await ChatHistory.findOne({
            userId: req.user._id,
            documentId
        }).select('messages');

        if(!chatHistory){
            res.status(200).json({
                success:true,
                data : [],
                message: 'No Chat History Found for this Document'
            })
        }


        res.status(200).json({
            success: true,
            data: chatHistory.messages,
            message: 'Chat History Retrieved Successfully'
        });
    } catch (error) {
        next(error);
    }
};

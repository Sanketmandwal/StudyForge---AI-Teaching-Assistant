import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/aiPaths";

const generateFlashcard = async (documentId , options) => {
    try {
        const response = await axiosInstance.post(API_PATHS.AI.GENERATE_FLASHCARDS, {
            documentId,
            ...options,
        });
        return response.data;
    } catch (error) {
        console.error("Error generating flashcard:", error);
        throw error.response?.data || { message: "Flashcard generation failed" };
    }
};

const generateQuiz = async (documentId , options) => {
    try {
        const response = await axiosInstance.post(API_PATHS.AI.GENERATE_QUIZ, {
            documentId,
            ...options,
        });
        return response.data;
    } catch (error) {
        console.error("Error generating quiz:", error);
        throw error.response?.data || {message : "Quiz generation failed"}
    }
};

const generateSummary = async (documentId) => {
    try {
        const response = await axiosInstance.post(API_PATHS.AI.GENERATE_SUMMARY, {documentId});
        return response.data;
    } catch (error) {
        console.error("Error generating summary:", error);
        throw error.response?.data ||  {message: "Summary generation failed"}
    }
};

const chat = async (documentId, message) => {
    try {
        const response = await axiosInstance.post(API_PATHS.AI.CHAT, { documentId , question : message });
        return response.data;
    } catch (error) {
        console.error("Error in chat:", error);
        throw error.response?.data || { message: "Chat failed"};
    }
};

const getChatHistory = async (documentId) => {
    try {
        const response = await axiosInstance.get(API_PATHS.AI.GET_CHAT_HISTORY(documentId));
        return response.data;
    } catch (error) {
        console.error("Error fetching chat history:", error);
        throw error.response?.data || { message: "Fetching chat history failed"};
    }
};

const explainConcept = async (documentId , concept) => {
    try {
        const response = await axiosInstance.post(API_PATHS.AI.EXPLAIN_CONCEPT, {documentId , concept });
        return response.data;
    } catch (error) {
        console.error("Error explaining concept:", error);
        throw error.response?.data || { message: "Concept explanation failed"};
    }
};

const aiService = {
    generateFlashcard,
    generateQuiz,
    generateSummary,
    chat,
    getChatHistory,
    explainConcept,
};

export default aiService;
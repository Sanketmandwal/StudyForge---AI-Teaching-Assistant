import Flashcard from "../models/Flashcard.js";


export const getFlashcards = async (req, res, next) => {
    try {
        const { documentId } = req.params;
        const userId = req.user._id;

        const flashcardSets = await Flashcard.find({
            documentId,
            userId
        }).lean(); // Just use lean(), no populate needed

        res.status(200).json({
            success: true,
            data: flashcardSets,
            message: 'Flashcard sets retrieved successfully'
        });
    } catch (error) {
        console.error('Get flashcards error:', error);
        next(error);
    }
};

export const getAllFlashcardSets = async (req, res, next) => {
    try {
        const userId = req.user._id;

        const flashcardSets = await Flashcard.find({ userId })
            .populate('documentId', 'title') // Only populate needed fields
            .lean(); // Add this

        res.status(200).json({
            success: true,
            data: flashcardSets,
            message: 'All flashcard sets retrieved successfully'
        });
    } catch (error) {
        console.error('Get all flashcard sets error:', error);
        next(error);
    }
};

export const reviewFlashcard = async (req, res, next) => {
    try {
        const { cardId } = req.params;
        const { rating } = req.body;
        const userId = req.user._id;

        // Find the flashcard set containing this card
        const flashcardSet = await Flashcard.findOne({
            userId,
            'cards._id': cardId
        });

        if (!flashcardSet) {
            return res.status(404).json({
                success: false,
                message: 'Flashcard not found'
            });
        }

        // Update the specific card's review data
        const card = flashcardSet.cards.id(cardId);
        card.lastReviewed = new Date();
        card.reviewCount = (card.reviewCount || 0) + 1;
        
        await flashcardSet.save();

        res.status(200).json({
            success: true,
            message: 'Flashcard reviewed successfully'
        });
    } catch (error) {
        console.error('Review flashcard error:', error);
        next(error);
    }
};

export const toggleStarFlashcard = async (req, res, next) => {
    try {
        const { cardId } = req.params;
        const userId = req.user._id;

        // Find the flashcard set containing this card
        const flashcardSet = await Flashcard.findOne({
            userId,
            'cards._id': cardId
        });

        if (!flashcardSet) {
            return res.status(404).json({
                success: false,
                message: 'Flashcard not found'
            });
        }

        // Toggle the starred status
        const card = flashcardSet.cards.id(cardId);
        card.isStarred = !card.isStarred;
        
        await flashcardSet.save();

        res.status(200).json({
            success: true,
            data: { starred: card.starred },
            message: 'Flashcard star status updated'
        });
    } catch (error) {
        console.error('Toggle star error:', error);
        next(error);
    }
};

export const deleteFlashcardSet = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        const flashcardSet = await Flashcard.findOneAndDelete({
            _id: id,
            userId
        });

        if (!flashcardSet) {
            return res.status(404).json({
                success: false,
                message: 'Flashcard set not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Flashcard set deleted successfully'
        });
    } catch (error) {
        console.error('Delete flashcard set error:', error);
        next(error);
    }
};

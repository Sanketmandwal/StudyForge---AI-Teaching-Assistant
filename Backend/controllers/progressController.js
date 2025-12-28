import Quiz from "../models/Quiz.js";
import Flashcard from "../models/Flashcard.js";
import Document from "../models/Document.js";

// Helper function to calculate study streak
const calculateStudyStreak = (activities) => {
    if (!activities || activities.length === 0) return 0;

    // Get unique dates and sort them (most recent first)
    const uniqueDates = [...new Set(activities.map(date => {
        const d = new Date(date);
        d.setHours(0, 0, 0, 0);
        return d.getTime();
    }))].sort((a, b) => b - a);

    if (uniqueDates.length === 0) return 0;

    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayTime = today.getTime();

    // Check if the most recent activity is today or yesterday
    const mostRecentActivity = uniqueDates[0];
    const daysSinceLastActivity = Math.floor((todayTime - mostRecentActivity) / (1000 * 60 * 60 * 24));

    // If last activity was more than 1 day ago, streak is broken
    if (daysSinceLastActivity > 1) return 0;

    // Count consecutive days
    let expectedDate = todayTime;
    
    for (let i = 0; i < uniqueDates.length; i++) {
        const activityDate = uniqueDates[i];
        const dayDiff = Math.floor((expectedDate - activityDate) / (1000 * 60 * 60 * 24));

        if (dayDiff === 0) {
            streak++;
            expectedDate = activityDate - (1000 * 60 * 60 * 24); // Move to previous day
        } else if (dayDiff === 1) {
            // There's a 1-day gap, continue checking
            expectedDate = activityDate - (1000 * 60 * 60 * 24);
        } else {
            // Gap is more than 1 day, break the streak
            break;
        }
    }

    return streak;
};

// Helper function to calculate total study time
const calculateTotalStudyTime = (documents, quizzes) => {
    // Estimate: 5 minutes per document + 2 minutes per quiz question
    let totalMinutes = 0;
    
    // Count completed/processed documents
    const completedDocs = documents.filter(doc => 
        doc.status === 'completed' || doc.status === 'processed'
    ).length;
    totalMinutes += completedDocs * 15; // Average 15 minutes per document

    // Count quiz time
    quizzes.forEach(quiz => {
        totalMinutes += (quiz.totalQuestions || 5) * 2;
    });

    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    return `${hours}h ${minutes}m`;
};

// Helper: Get most productive day of the week
const getMostProductiveDay = (activityDates) => {
    if (!activityDates || activityDates.length === 0) return 'Monday';

    const dayCounts = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    activityDates.forEach(date => {
        const day = new Date(date).getDay();
        dayCounts[day]++;
    });

    const maxDay = Object.keys(dayCounts).reduce((a, b) => 
        dayCounts[a] > dayCounts[b] ? a : b
    );

    return dayNames[maxDay];
};

// Helper: Calculate study consistency (0-100)
const calculateConsistency = (activityDates) => {
    if (!activityDates || activityDates.length === 0) return 0;

    const last30Days = new Date();
    last30Days.setDate(last30Days.getDate() - 30);

    const recentActivities = activityDates.filter(date => new Date(date) >= last30Days);
    
    // Get unique days
    const uniqueDays = new Set(
        recentActivities.map(date => {
            const d = new Date(date);
            return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
        })
    );

    // Consistency = (days studied / 30) * 100
    return Math.min(100, Math.round((uniqueDays.size / 30) * 100));
};

// Check if studied today
const checkStudiedToday = (activityDates) => {
    if (!activityDates || activityDates.length === 0) return false;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayTime = today.getTime();

    return activityDates.some(date => {
        const activityDate = new Date(date);
        activityDate.setHours(0, 0, 0, 0);
        return activityDate.getTime() === todayTime;
    });
};

// Get weekly activities count
const getWeeklyActivities = (activityDates) => {
    if (!activityDates || activityDates.length === 0) return 0;

    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    weekAgo.setHours(0, 0, 0, 0);

    return activityDates.filter(date => new Date(date) >= weekAgo).length;
};

export const getDashboard = async (req, res, next) => {
    try {
        const userId = req.user._id;

        // Fetch all data
        const [documents, flashcardSets, allQuizzes, completedQuizzes] = await Promise.all([
            Document.find({ userId }).select('title fileName lastAccessed status createdAt updatedAt'),
            Flashcard.find({ userId }),
            Quiz.find({ userId }).select('completedAt score totalQuestions createdAt'),
            Quiz.find({ userId, completedAt: { $ne: null } })
                .populate('documentId', 'title')
                .select('title score totalQuestions completedAt')
                .sort({ completedAt: -1 })
                .limit(5)
        ]);

        // Basic counts
        const totalDocuments = documents.length;
        const totalFlashcardSets = flashcardSets.length;
        const totalQuizzes = allQuizzes.length;
        const completedQuizzesCount = allQuizzes.filter(q => q.completedAt).length;

        // Flashcard statistics
        let totalFlashcards = 0;
        let reviewedFlashcards = 0;
        let starredFlashcards = 0;

        flashcardSets.forEach(set => {
            totalFlashcards += set.cards?.length || 0;
            reviewedFlashcards += set.cards?.filter(card => card.reviewCount > 0).length || 0;
            starredFlashcards += set.cards?.filter(card => card.isStarred).length || 0;
        });

        // Quiz statistics
        const completedQuizzesData = allQuizzes.filter(q => q.completedAt);
        const averageScore = completedQuizzesData.length > 0 
            ? Math.round(completedQuizzesData.reduce((acc, quiz) => acc + (quiz.score || 0), 0) / completedQuizzesData.length) 
            : 0;

        // Collect all activity dates for streak calculation
        const activityDates = [];

        // Document activities
        documents.forEach(doc => {
            if (doc.lastAccessed) activityDates.push(doc.lastAccessed);
            if (doc.createdAt) activityDates.push(doc.createdAt);
            if (doc.updatedAt && doc.status === 'completed') activityDates.push(doc.updatedAt);
        });

        // Quiz activities
        allQuizzes.forEach(quiz => {
            if (quiz.completedAt) activityDates.push(quiz.completedAt);
            if (quiz.createdAt) activityDates.push(quiz.createdAt);
        });

        // Flashcard activities
        flashcardSets.forEach(set => {
            if (set.createdAt) activityDates.push(set.createdAt);
            if (set.updatedAt) activityDates.push(set.updatedAt);
        });

        // Calculate metrics
        const studyStreak = calculateStudyStreak(activityDates);
        const totalStudyTime = calculateTotalStudyTime(documents, completedQuizzesData);
        const studiedToday = checkStudiedToday(activityDates);
        const weeklyActivities = getWeeklyActivities(activityDates);
        const completionRate = totalQuizzes > 0 
            ? Math.round((completedQuizzesCount / totalQuizzes) * 100) 
            : 0;

        // Recent documents
        const recentDocuments = documents
            .sort((a, b) => {
                const dateA = a.lastAccessed || a.createdAt;
                const dateB = b.lastAccessed || b.createdAt;
                return new Date(dateB) - new Date(dateA);
            })
            .slice(0, 5);

        res.status(200).json({
            success: true,
            data: {
                overview: {
                    totalDocuments,
                    totalFlashcardSets,
                    totalFlashcards,
                    reviewedFlashcards,
                    starredFlashcards,
                    totalQuizzes,
                    completedQuizzes: completedQuizzesCount,
                    averageScore,
                    studyStreak,
                    studiedToday,
                    completionRate,
                    totalStudyTime,
                    weeklyActivities
                },
                recentActivity: {
                    documents: recentDocuments,
                    quizzes: completedQuizzes
                },
                insights: {
                    mostProductiveDay: getMostProductiveDay(activityDates),
                    studyConsistency: calculateConsistency(activityDates),
                    totalActivities: activityDates.length,
                    averageSessionsPerWeek: Math.round(weeklyActivities / 1) || 0
                }
            }
        });

    } catch (error) {
        console.error('Dashboard error:', error);
        next(error);
    }
};

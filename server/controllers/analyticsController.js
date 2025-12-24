import { getDb } from '../database.js';

export const getAnalytics = async (req, res) => {
    try {
        const userId = req.user.id;
        const db = await getDb();

        // 1. Category Spend
        const categoryData = await db.all(
            `SELECT category, SUM(amount) as total 
       FROM transactions 
       WHERE user_id = ? AND status = 'success' 
       GROUP BY category`,
            [userId]
        );

        // 2. Daily Spend (Last 7 days)
        const dailyData = await db.all(
            `SELECT date(date) as day, SUM(amount) as total 
       FROM transactions 
       WHERE user_id = ? AND status = 'success' 
       GROUP BY day 
       ORDER BY day DESC 
       LIMIT 7`,
            [userId]
        );

        // 3. Status Review (Success vs Failed vs Flagged)
        const statusData = await db.all(
            `SELECT status, COUNT(*) as count 
       FROM transactions 
       WHERE user_id = ? 
       GROUP BY status`,
            [userId]
        );

        // 4. Fraud Stats
        const fraudData = await db.get(
            `SELECT COUNT(*) as flagged_count, SUM(amount) as flagged_amount 
       FROM transactions 
       WHERE user_id = ? AND risk_level IN ('High', 'Medium')`,
            [userId]
        );

        // AI Heuristic Analysis
        const insights = [];
        const reversedDailyData = dailyData.reverse(); // Ensure chronological for analysis
        const spendingTrend = (reversedDailyData[6]?.total || 0) - (reversedDailyData[5]?.total || 0);

        if (spendingTrend > 50) {
            insights.push({
                type: 'warning',
                message: `You spent ₹${spendingTrend.toFixed(2)} more today than yesterday.`,
                tip: 'Try to limit non-essential purchases for the rest of the week.'
            });
        } else if (spendingTrend < -50) {
            insights.push({
                type: 'success',
                message: `Great job! You spent ₹${Math.abs(spendingTrend).toFixed(2)} less than yesterday.`,
                tip: 'Keep up the momentum to reach your savings goals.'
            });
        }

        // categoryData is an array of objects like [{ category: 'Food', total: 100 }]
        // We need to find the object with the highest total
        const highestCategory = categoryData.reduce((prev, current) => {
            return (prev.total > current.total) ? prev : current
        }, { category: '', total: 0 }); // Initialize with a default object

        if (highestCategory.category) { // Check if a valid category was found
            insights.push({
                type: 'info',
                message: `Your highest spending is in ${highestCategory.category} (₹${highestCategory.total.toFixed(2)}).`,
                tip: highestCategory.category === 'Food' ? 'Cooking at home can save you ~30% monthly.' : 'Review subscription services you might not be using.'
            });
        }

        // Fraud Insight
        if (fraudData.flagged_count > 0) { // Use fraudData.flagged_count
            insights.push({
                type: 'alert',
                message: `${fraudData.flagged_count} transactions were flagged as potential risks recently.`,
                tip: 'Review your transaction history immediately.'
            });
        }

        res.json({ dailyData: reversedDailyData, categoryData: categoryStats, fraudStats: fraudData, insights, statusData }); // Include statusData and use original variable names
    } catch (error) {
        console.error('Analytics error:', error); // Keep original error message for consistency
        res.status(500).json({ error: 'Server error' }); // Keep original error message for consistency
    }
};

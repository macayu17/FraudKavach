export const analyzeTransaction = (transaction, userHistory) => {
    const risks = [];
    let score = 0;

    // Rule 1: High Amount (> 2x average)
    const avgSpend = userHistory.length > 0
        ? userHistory.reduce((sum, t) => sum + t.amount, 0) / userHistory.length
        : 1000; // Default fallback average

    if (transaction.amount > avgSpend * 2) {
        score += 40;
        risks.push(`Amount ($${transaction.amount}) is 2x higher than average spend ($${avgSpend.toFixed(2)})`);
    }

    // Rule 2: Rapid Failures (Simulated check - normally requires looking at recent failed logs)
    // For simulation, we check if generic "risk_flag" payload was sent or by category
    if (transaction.merchant === 'Cryptocoin Unreg' || transaction.category === 'Gambling') {
        score += 50;
        risks.push('High-risk merchant category detected');
    }

    // Rule 3: International Transaction
    if (transaction.type === 'International') {
        score += 20;
        risks.push('International transaction initiated');
    }

    // Determine Level
    let level = 'Low';
    if (score >= 70) level = 'High';
    else if (score >= 30) level = 'Medium';

    return {
        risk_score: score,
        risk_level: level,
        risk_reasons: risks
    };
};

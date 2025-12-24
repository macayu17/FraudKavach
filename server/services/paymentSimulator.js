export const simulatePaymentProcessing = async (transaction) => {
    // Simulate network delay (500ms - 2000ms)
    const delay = Math.floor(Math.random() * 1500) + 500;
    await new Promise(resolve => setTimeout(resolve, delay));

    // 10% Random Failure Rate simulating network issues or bank declines
    if (Math.random() < 0.10) {
        throw new Error('Payment Gateway Error: Bank Declined Transaction');
    }

    // Specific simulation for "Insufficient Funds" based on amount (fake logic)
    if (transaction.amount > 50000) {
        throw new Error('Insufficient Funds');
    }

    return true;
};

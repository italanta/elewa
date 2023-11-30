// Function to pause execution for a specified time
export const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
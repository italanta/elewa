import { AssessmentProgress, AssessmentResult, Attempt, BarChartData } from "@app/model/convs-mgr/micro-app/assessments";

/**
 * Calculates various statistics from a list of assessment progress records.
 * 
 * @param progress - An array of AssessmentProgress objects representing the progress of different students.
 * @returns An object containing the lowest, highest, and average scores, average time to completion,
 *          pie chart data, and bar chart data.
 */
export function calculateAssessmentResult(progress: AssessmentProgress[]): AssessmentResult {
  const initialStatistics: AssessmentResult = {
    lowestScore: Number.MAX_VALUE,
    highestScore: Number.MIN_VALUE,
    averageScore: 0,
    averageTimeToCompletion: 0,
    pieChartData: { done: 0, inProgress: 0 },
    barChartData: initializeBarChartData()
  };

  const results = progress.reduce((acc, assessment) => {
    const latestAttempt = assessment.attempts[assessment.attemptCount];

    if (latestAttempt) {
      updateScoreStatistics(latestAttempt, assessment.maxScore, acc);
      updateTimeStatistics(latestAttempt, acc);
      updatePieChartData(latestAttempt, acc);
      updateBarChartData(latestAttempt, assessment.maxScore, acc.barChartData);
    }

    return acc;
  }, initialStatistics);

  // Calculate averages
  results.averageScore = results.averageScore / progress.length;
  results.averageTimeToCompletion = results.averageTimeToCompletion / progress.length;

  // Handle edge cases for lowest and highest scores
  results.lowestScore = results.lowestScore === Number.MAX_VALUE ? 0 : results.lowestScore;
  results.highestScore = results.highestScore === Number.MIN_VALUE ? 0 : results.highestScore;

  return results;
}

/**
 * Initializes the bar chart data ranges.
 * 
 * @returns An array of BarChartData with ranges and initial counts set to 0.
 */
function initializeBarChartData(): BarChartData[] {
  return [
    { range: "0-10", count: 0 },
    { range: "11-20", count: 0 },
    { range: "21-30", count: 0 },
    { range: "31-40", count: 0 },
    { range: "41-50", count: 0 },
    { range: "51-60", count: 0 },
    { range: "61-70", count: 0 },
    { range: "71-80", count: 0 },
    { range: "81-90", count: 0 },
    { range: "91-100", count: 0 }
  ];
}

/**
 * Updates score statistics including lowest, highest, and average score.
 * 
 * @param latestAttempt - The latest attempt object of an assessment.
 * @param maxScore - The maximum possible score for the assessment.
 * @param acc - The accumulator object holding intermediate statistics.
 */
function updateScoreStatistics(latestAttempt: Attempt, maxScore: number, acc: AssessmentResult): void {
  const scorePercentage = (latestAttempt.score / maxScore) * 100;

  if (scorePercentage < acc.lowestScore) {
    acc.lowestScore = scorePercentage;
  }

  if (scorePercentage > acc.highestScore) {
    acc.highestScore = scorePercentage;
  }

  acc.averageScore += scorePercentage;
}

/**
 * Updates time-related statistics.
 * 
 * @param latestAttempt - The latest attempt object of an assessment.
 * @param acc - The accumulator object holding intermediate statistics.
 */
function updateTimeStatistics(latestAttempt: Attempt, acc: AssessmentResult): void {
  if (latestAttempt.finishedOn && latestAttempt.startedOn) {
    acc.averageTimeToCompletion += (latestAttempt.finishedOn - latestAttempt.startedOn);
  }
}

/**
 * Updates the pie chart data based on the latest attempt status.
 * 
 * @param latestAttempt - The latest attempt object of an assessment.
 * @param acc - The accumulator object holding intermediate statistics.
 */
function updatePieChartData(latestAttempt: Attempt, acc: AssessmentResult): void {
  if (latestAttempt.finishedOn) {
    acc.pieChartData.done++;
  } else if (latestAttempt.outcome === 'incomplete') {  // Assuming 'incomplete' is the correct status
    acc.pieChartData.inProgress++;
  }
}

/**
 * Updates the bar chart data with the score percentage distribution.
 * 
 * @param latestAttempt - The latest attempt object of an assessment.
 * @param maxScore - The maximum possible score for the assessment.
 * @param barChartData - The array of BarChartData to be updated.
 */
function updateBarChartData(latestAttempt: Attempt, maxScore: number, barChartData: BarChartData[]): void {
  const scorePercentage = (latestAttempt.score / maxScore) * 100;

  for (let i = 0; i < barChartData.length; i++) {
    const [min, max] = barChartData[i].range.split('-').map(Number);
    if (scorePercentage >= min && scorePercentage <= max) {
      barChartData[i].count++;
      break;
    }
  }
}
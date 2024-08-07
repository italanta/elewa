import { IObject } from "@iote/bricks";

/**
 * Represents the results of an assessment analysis.
 */
export interface AssessmentResult extends IObject {
  /** The lowest score percentage among all assessments */
  lowestScore: number;

  /** The highest score percentage among all assessments */
  highestScore: number;

  /** The average score percentage among all assessments */
  averageScore: number;

  /** The average time to completion for the latest attempts of all assessments (in milliseconds) */
  averageTimeToCompletion: number;

  /** Data for the pie chart representing the number of assessments that are done and in progress */
  pieChartData: PieChartData;

  /** Data for the bar chart representing the distribution of scores in percentage ranges */
  barChartData: BarChartData[];
}

/**
 * Represents data for a pie chart, showing the status of assessments.
 */
export interface PieChartData {
  /** Number of learners that have completed */
  done: number;

  /** Number of learners that are still doing the assessment */
  inProgress: number;

  /** Number of learners that have not yet started the assessment */
  notStarted?: number;
}

/**
 * Represents data for a single bar in a bar chart, indicating the number of students within a specific score range.
 */
export interface BarChartData {
  /** The score range represented as a string (e.g., "0-10", "11-20") */
  range: string;

  /** The number of students whose scores fall within the specified range */
  count: number;
}

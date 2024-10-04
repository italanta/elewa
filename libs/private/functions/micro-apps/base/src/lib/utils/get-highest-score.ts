import { AttemptsMap } from "@app/model/convs-mgr/micro-app/assessments";

export function getHighestPercentageScore(attempts: AttemptsMap){
  const highestPercentage = Object.values(attempts).reduce((highestPercentage, attempt) => {
    const attemptPercentage = Math.min(attempt.finalScorePercentage, 100);
    return Math.max(highestPercentage, attemptPercentage);
  }, 0);
  return highestPercentage;
}
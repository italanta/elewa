import { HandlerTools } from "@iote/cqrs";

import { AssessmentProgress, AssessmentProgressUpdate, Attempt, QuestionResponse } from "@app/model/convs-mgr/micro-app/assessments";

export class AssessmentProgressService
{
  constructor(private tools: HandlerTools) { }

  private _getCurrentProgress(progress: AssessmentProgressUpdate)
  {
    const resultsPath = `orgs/${progress.orgId}/end-users/${progress.endUserId}/assessment-progress`;
    const assessmentResultsRepo$ = this.tools.getRepository<AssessmentProgress>(resultsPath);

    return assessmentResultsRepo$.getDocumentById(progress.appId);
  }

  private _initProgress(newProgress: AssessmentProgressUpdate, attemptCount: number): AssessmentProgress
  {
    const attempts = new Map<number, Attempt>();

    const newAttempt = this._getNewAttempt(newProgress);

    attempts.set(attemptCount, newAttempt);

    const progress: AssessmentProgress = {
      id: newProgress.appId,
      attemptCount,
      finalScore: 0,
      maxScore: newProgress.assessmentDetails.maxScore,
      attempts
    };

    return progress;
  }

  private _getScore(questionResponses: QuestionResponse[]) {
    let score = 0;

    questionResponses.forEach((response)=> {
      if(response.answerId && response.answerId === response.correctAnswer) {
        score++;
      } 

      // TODO: Add intelligent matching of user response to correct answer
      if(response.answerText === response.correctAnswer) {
        score++;
      }
    })

    return score;
  }

  async trackProgress(progressUpdate: AssessmentProgressUpdate)
  {
    const currentProgress = await this._getCurrentProgress(progressUpdate);
    let newProgress: AssessmentProgress;
    if (currentProgress) {

      const currentAttempt = currentProgress.attempts.get(currentProgress.attemptCount);

      if(currentAttempt.questionResponses.length === progressUpdate.assessmentDetails.questionCount) {
        // The end of the attempt and start a new attempt
        const newAttempt = this._getNewAttempt(progressUpdate);
        currentProgress.attemptCount++;
        currentProgress.attempts.set(currentProgress.attemptCount, newAttempt);
      } else {
        currentAttempt.score+= this._getScore(progressUpdate.questionResponses);
        currentAttempt.questionResponses.push(...progressUpdate.questionResponses);

        currentProgress.attempts.set(currentProgress.attemptCount, currentAttempt);
      }

      newProgress = currentProgress;
    } else {
      newProgress = this._initProgress(progressUpdate, 1);
    }

    return this._updateProgress(newProgress, progressUpdate);
  }

  private _getNewAttempt(newProgress: AssessmentProgressUpdate) {
    const newAttempt: Attempt = {
      score: this._getScore(newProgress.questionResponses),
      questionResponses: newProgress.questionResponses,
      startedOn: new Date()
    };

    return newAttempt;
  }

  private _updateProgress(newProgress: AssessmentProgress, progressUpdate: AssessmentProgressUpdate)
  {
    const resultsPath = `orgs/${progressUpdate.orgId}/end-users/${progressUpdate.endUserId}/assessment-progress`;
    const assessmentResultsRepo$ = this.tools.getRepository<AssessmentProgress>(resultsPath);

    return assessmentResultsRepo$.write(newProgress, progressUpdate.appId);
  }
} 
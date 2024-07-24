import { HandlerTools } from "@iote/cqrs";
import { Query } from "@ngfi/firestore-qbuilder";

import { AssessmentProgress, AssessmentProgressUpdate, AssessmentStatusTypes, Attempt, AttemptsMap, QuestionResponse } from "@app/model/convs-mgr/micro-app/assessments";
import { MicroAppProgress } from "@app/model/convs-mgr/micro-app/base";
import { AssessmentQuestion } from "@app/model/convs-mgr/conversations/assessments";

import { mapResponses } from "../utils/assessment-responses-map.util";

export class AssessmentProgressService
{
  constructor(private tools: HandlerTools) { }

  private _getCurrentProgress(progress: AssessmentProgressUpdate)
  {
    const resultsPath = `orgs/${progress.orgId}/end-users/${progress.endUserId}/assessment-progress`;
    const assessmentResultsRepo$ = this.tools.getRepository<AssessmentProgress>(resultsPath);

    return assessmentResultsRepo$.getDocumentById(progress.appId);
  }

  /**
   * Send the feedback pdf as a message to the end user
   */
  sendFeedbackPDF() {

  }

  getAllQuestions(assessmentId: string, orgId: string) {
    const qRepo$ = this.tools.getRepository<AssessmentQuestion>(`orgs/${orgId}/assessments/${assessmentId}/questions`);

    return qRepo$.getDocuments(new Query());
  }

  private _initProgress(newProgress: AssessmentProgressUpdate, attemptCount: number): AssessmentProgress
  {
    const newAttempt = this._getNewAttempt(newProgress);

    const attempts: AttemptsMap = {
      1: newAttempt
    }

    const progress: AssessmentProgress = {
      id: newProgress.appId,
      attemptCount,
      finalScore: 0,
      maxScore: newProgress.assessmentDetails.maxScore,
      attempts,
      orgId: newProgress.orgId,
      endUserId: newProgress.endUserId,
      title: newProgress.assessmentDetails.title
    };

    return progress;
  }

  private _getScore(questionResponses: QuestionResponse[]) {
    let score = 0;

      for(const response of questionResponses) {
        if(response.answerId && response.answerId === response.correctAnswer) {
          score+= response.marks;
          response.score = response.marks;
          response.correct = true;
        } else {
          response.score = 0;
        }
        
        // TODO: Add intelligent matching of user response to correct answer
        if(response.answerText === response.correctAnswer) {
          score+= response.marks;
          response.score = response.marks
          response.correct = true;
        } else {
          response.score = 0;
        }
      }
  

    return {score, questionResponses};
  }

  async trackProgress(progress: MicroAppProgress)
  {
    const progressUpdate = progress as AssessmentProgressUpdate;
    
    const currentProgress = await this._getCurrentProgress(progressUpdate);
    let newProgress: AssessmentProgress;

    if (currentProgress) {

      const currentAttempt = currentProgress.attempts[currentProgress.attemptCount];

      if(currentAttempt.finishedOn) {
        // The end of the attempt and start a new attempt
        const newAttempt = this._getNewAttempt(progressUpdate);
        currentProgress.attemptCount++;
        currentProgress.attempts[currentProgress.attemptCount] = newAttempt;
      } else {
        const {score, questionResponses} = this._getScore(progressUpdate.questionResponses);
        currentAttempt.score+= score

        if(progressUpdate.hasSubmitted) currentAttempt.finishedOn = Date.now();

        currentAttempt.questionResponses = mapResponses(questionResponses, currentAttempt.questionResponses);

        currentProgress.attempts[currentProgress.attemptCount] = currentAttempt;
      }

      newProgress = currentProgress;
    } else {
      newProgress = this._initProgress(progressUpdate, 1);
    }

    newProgress = this._updateOutcome(newProgress);
    
    return this._updateProgress(newProgress, progressUpdate);
  }

  private _getNewAttempt(newProgress: AssessmentProgressUpdate) {
    const {score, questionResponses} = this._getScore(newProgress.questionResponses);
    const newAttempt: Attempt = {
      score: score,
      questionResponses: mapResponses(questionResponses),
      startedOn:  Date.now()
    };

    return newAttempt;
  }

  private _getOutcome(score: number, passMark?: number) {
    if(!passMark) return AssessmentStatusTypes.Completed;

    if(score <= passMark) {
      return AssessmentStatusTypes.Failed;
    } else {
      return AssessmentStatusTypes.Passed;
    }
  }

  private _updateOutcome(progress: AssessmentProgress) {
    const currentAttempt = progress.attempts[progress.attemptCount];

    if(currentAttempt.finishedOn) {
      const passMark = progress.moveOnCriteria ? progress.moveOnCriteria.passMark : undefined;
      currentAttempt.outcome = this._getOutcome(currentAttempt.score, passMark)
    } else {
      currentAttempt.outcome = AssessmentStatusTypes.Incomplete;
    }

    progress.attempts[progress.attemptCount] = currentAttempt;

    return progress;
  }

  private _updateProgress(newProgress: AssessmentProgress, progressUpdate: AssessmentProgressUpdate)
  {
    const resultsPath = `orgs/${progressUpdate.orgId}/end-users/${progressUpdate.endUserId}/assessment-progress`;
    const assessmentResultsRepo$ = this.tools.getRepository<AssessmentProgress>(resultsPath);

    return assessmentResultsRepo$.write(newProgress, progressUpdate.appId);
  }
} 
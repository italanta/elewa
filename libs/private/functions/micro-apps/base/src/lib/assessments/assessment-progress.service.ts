import axios from "axios";

import { HandlerTools } from "@iote/cqrs";
import { Query } from "@ngfi/firestore-qbuilder";

import { AssessmentProgress, AssessmentProgressUpdate, AssessmentStatusTypes, Attempt, AttemptsMap, QuestionResponse } from "@app/model/convs-mgr/micro-app/assessments";
import { AssessmentMicroApp, MicroAppProgress, MicroAppStatus } from "@app/model/convs-mgr/micro-app/base";
import { AssessmentQuestion } from "@app/model/convs-mgr/conversations/assessments";
import { DocumentMessage, Message, MessageDirection } from "@app/model/convs-mgr/conversations/messages";
import { MessageTypes } from "@app/model/convs-mgr/functions";

import { mapResponses } from "../utils/assessment-responses-map.util";
import { getQuestionScore } from "../utils/get-question-score.util";
import { getTotalScore } from "../utils/get-total-score.util";

export class AssessmentProgressService
{
  constructor(private tools: HandlerTools) { }

  getCurrentProgress(orgId: string, endUserId: string, id: string)
  {
    const resultsPath = `orgs/${orgId}/end-users/${endUserId}/assessment-progress`;
    const assessmentResultsRepo$ = this.tools.getRepository<AssessmentProgress>(resultsPath);

    return assessmentResultsRepo$.getDocumentById(id);
  }

  async sendPDF(app: MicroAppStatus, tools: HandlerTools, n: number) {
    const assessmentConfig = app.config as AssessmentMicroApp;
    const pdfMessage: DocumentMessage = {
      caption: `Congratulations on completing the assessment, ${app.endUserName?.split(" ")[0]}! Attached is a PDF with your test results, including feedback on each question, for your records.`,
      endUserPhoneNumber: app.endUserId.split('_')[2],
      receipientId: app.endUserId.split('_')[2],
      type: MessageTypes.DOCUMENT,
      isDirect: true,
      url: assessmentConfig.pdf.url,
      n: n,
      documentName: assessmentConfig.pdf.name,
      direction: MessageDirection.FROM_CHATBOT_TO_END_USER,
      id: Date.now().toString()
    }

    const messagesRepo$ = tools.getRepository<Message>(`orgs/${app.config.orgId}/end-users/${app.endUserId}/messages`);

    return messagesRepo$.create(pdfMessage);
  }

  async generatePDF(progress: AssessmentProgress, tools: HandlerTools) {
    const url = this._getURL();
    const resp = await axios.post(url, {data: progress});
    tools.Logger.log(()=> `[AssessmentProgressService].generatePDF - Resp ${JSON.stringify(resp.data.result)}`);
    if(resp.data.result.success) {
      return resp.data.result.url;
    } else {
      return '';
    }
  }

  private _getURL() {
    const project = process.env.GCLOUD_PROJECT;
    const location = process.env.EVENTARC_CLOUD_EVENT_SOURCE.split('/')[3];

    return `https://${location}-${project}.cloudfunctions.net/getFeedbackPDF`
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
      title: newProgress.assessmentDetails.title,
      endUserName: newProgress.endUserName,
      moveOnCriteria: newProgress.assessmentDetails.moveOnCriteria || null,
      storyId: newProgress.assessmentDetails.storyId,
      moduleId: newProgress.assessmentDetails.moduleId,
      botId: newProgress.assessmentDetails.botId
    };

    return progress;
  }

  async trackProgress(progress: MicroAppProgress)
  {
    const progressUpdate = progress as AssessmentProgressUpdate;
    
    const currentProgress = await this.getCurrentProgress(progressUpdate.orgId, progressUpdate.endUserId, progress.appId);
    let newProgress: AssessmentProgress;

    if (currentProgress) {

      const currentAttempt = currentProgress.attempts[currentProgress.attemptCount];

      if(currentAttempt.finishedOn) {
        // The end of the attempt and start a new attempt
        const newAttempt = this._getNewAttempt(progressUpdate);
        currentProgress.attemptCount++;

        // If the assessment has been submitted mark as finished
        if(progressUpdate.hasSubmitted) newAttempt.finishedOn = Date.now();

        currentProgress.attempts[currentProgress.attemptCount] = newAttempt;

      } else {
        const { questionResponses} = getQuestionScore(progressUpdate.questionResponses);
        
        if(progressUpdate.hasSubmitted) currentAttempt.finishedOn = Date.now();

        currentAttempt.questionResponses = mapResponses(questionResponses, currentAttempt.questionResponses);

        currentProgress.attempts[currentProgress.attemptCount] = currentAttempt;
      }

      newProgress = currentProgress;
    } else {
      newProgress = this._initProgress(progressUpdate, 1);
      if(progressUpdate.hasSubmitted) newProgress.attempts[newProgress.attemptCount].finishedOn = Date.now();
    }

    newProgress = this._updateOutcome(newProgress);
    
    return this._updateProgress(newProgress);
  }

  private _getNewAttempt(newProgress: AssessmentProgressUpdate) {
    const { questionResponses } = getQuestionScore(newProgress.questionResponses);
    const newAttempt: Attempt = {
      score: 0,
      questionResponses: mapResponses(questionResponses),
      startedOn:  Date.now()
    };

    return newAttempt;
  }

  private _getOutcome(percentageScore: number, passMark?: number) {
    if(!passMark) return AssessmentStatusTypes.Completed;

    if(percentageScore <= passMark) {
      return AssessmentStatusTypes.Failed;
    } else {
      return AssessmentStatusTypes.Passed;
    }
  }

  private _updateOutcome(progress: AssessmentProgress) {
    const currentAttempt = progress.attempts[progress.attemptCount];

    currentAttempt.score = getTotalScore(currentAttempt.questionResponses);

    if(currentAttempt.finishedOn) {
      const percentageScore = Math.round(currentAttempt.score/progress.maxScore * 100);

      const passMark = progress.moveOnCriteria ? progress.moveOnCriteria.passMark : undefined;
      currentAttempt.outcome = this._getOutcome(percentageScore, passMark);
      currentAttempt.finalScorePercentage = percentageScore;
    } else {
      currentAttempt.outcome = AssessmentStatusTypes.Incomplete;
    }

    progress.attempts[progress.attemptCount] = currentAttempt;

    return progress;
  }

  private _updateProgress(newProgress: AssessmentProgress)
  {
    const resultsPath = `orgs/${newProgress.orgId}/end-users/${newProgress.endUserId}/assessment-progress`;
    const assessmentResultsRepo$ = this.tools.getRepository<AssessmentProgress>(resultsPath);

    return assessmentResultsRepo$.write(newProgress, newProgress.id);
  }
} 
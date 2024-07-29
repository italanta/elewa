import axios from "axios";

import { HandlerTools } from "@iote/cqrs";
import { Query } from "@ngfi/firestore-qbuilder";

import { AssessmentProgress, AssessmentProgressUpdate, AssessmentStatusTypes, Attempt, AttemptsMap, QuestionResponse } from "@app/model/convs-mgr/micro-app/assessments";
import { AssessmentMicroApp, MicroAppProgress, MicroAppStatus } from "@app/model/convs-mgr/micro-app/base";
import { AssessmentQuestion } from "@app/model/convs-mgr/conversations/assessments";
import { CommunicationChannel } from "@app/model/convs-mgr/conversations/admin/system";
import { SendOutgoingMsgHandler } from "@app/functions/bot-engine/send-message";
import { DocumentMessage, FileMessage, Message, MessageDirection } from "@app/model/convs-mgr/conversations/messages";
import { MessageTypes } from "@app/model/convs-mgr/functions";

import { mapResponses } from "../utils/assessment-responses-map.util";

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
      moveOnCriteria: newProgress.assessmentDetails.moveOnCriteria || null
    };

    return progress;
  }

  private _getScore(questionResponses: QuestionResponse[]) {
    let score = 0;
  
    for (let i = 0; i < questionResponses.length; i++) {
      if (questionResponses[i].answerId && questionResponses[i].answerId === questionResponses[i].correctAnswer) {
        score += questionResponses[i].marks;
        questionResponses[i].score = questionResponses[i].marks;
        questionResponses[i].correct = true;
      } else if (questionResponses[i].answerText === questionResponses[i].correctAnswer) {
        score += questionResponses[i].marks;
        questionResponses[i].score = questionResponses[i].marks;
        questionResponses[i].correct = true;
      } else {
        questionResponses[i].score = 0;
        questionResponses[i].correct = false;
      }
    }
  
    return { score, questionResponses };
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
    
    return this._updateProgress(newProgress);
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

  private _updateProgress(newProgress: AssessmentProgress)
  {
    const resultsPath = `orgs/${newProgress.orgId}/end-users/${newProgress.endUserId}/assessment-progress`;
    const assessmentResultsRepo$ = this.tools.getRepository<AssessmentProgress>(resultsPath);

    return assessmentResultsRepo$.write(newProgress, newProgress.id);
  }
} 
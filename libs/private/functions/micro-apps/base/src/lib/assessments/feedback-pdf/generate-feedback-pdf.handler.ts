import { tmpdir } from "os";
import { join } from "path";

import puppeteer from "puppeteer";

import * as admin from 'firebase-admin';

import { HandlerTools } from '@iote/cqrs';
import { FunctionHandler, FunctionContext, RestResult } from '@ngfi/functions';

import { AssessmentProgress } from '@app/model/convs-mgr/micro-app/assessments';
import { EndUser } from '@app/model/convs-mgr/conversations/chats';
import { Organisation } from '@app/model/organisation';

import { AssessmentProgressService } from '../assessment-progress.service';
import { QuestionsToHTML } from './questions-to-html';
import { FeedbackTemplateHTML } from './feedback-template';

/**
 * Handler responsible for updating user progress in micro-apps via a webhook callback.
 */
export class GetFeedbackPDFHandler extends FunctionHandler<AssessmentProgress, RestResult> 
{
  public async execute(req: AssessmentProgress, context: FunctionContext, tools: HandlerTools): Promise<any> 
  {
    tools.Logger.log(() => `Generating PDF for progress ${JSON.stringify(req)}`);

    try {
      const assessmentProgressSrv = new AssessmentProgressService(tools);
      const allQuestions = await assessmentProgressSrv.getAllQuestions(req.id, req.orgId);
      const questionsHTML = QuestionsToHTML(allQuestions, req);
      const endUserRepo$ = tools.getRepository<EndUser>(`orgs/${req.orgId}/end-users`);
      const endUser = await endUserRepo$.getDocumentById(req.endUserId);

      const orgRepo$ = tools.getRepository<Organisation>(`orgs`);
      const org = await orgRepo$.getDocumentById(req.orgId);

      const headerDetails = {
        assessmentTitle: req.title,
        logoURL: org.logoUrl,
        learnerName: endUser.variables['name'] || '',
        organisationName: org.name
      };

      const formattedTitle = req.title.split(' ').join('_');
      const formattedName = endUser.name.split(' ').join('_');

      const pdfName = `${formattedName}_${formattedTitle}_${Date.now()}.pdf`;

      const feedbackHTML = FeedbackTemplateHTML(headerDetails, questionsHTML);

      const tempFilePath = join(tmpdir(), pdfName);

      await this.generatePDF(feedbackHTML, tempFilePath);

      const resp = await this._uploadFile(req.orgId, req.endUserId, tempFilePath, pdfName, tools);

      if(resp) {
        return { success: false, resp };
      } else {
        throw `${JSON.stringify(resp)}`;
      }
      // return assessmentProgressSrv.trackProgress(req);
    } catch (error) {
      tools.Logger.error(() => `[UpdateMicroAppProgressHandler].execute - Encountered error :: ${JSON.stringify(error)}`);
      return { success: false, error: JSON.stringify(error) };
    }
  }

  async generatePDF(feedbackHTML: string, filePath: string)
  {
    const browser = await puppeteer.launch();

    const page = await browser.newPage();

    await page.setContent(feedbackHTML);

    await page.pdf({ path: filePath, format: 'A4', printBackground: true });

    await browser.close();
  }

  private async _uploadFile(orgId: string, endUserId: string, filePath: string, fileName: string, tools: HandlerTools)
  {

    const path = `orgs/${orgId}/end-users/${endUserId}/assessments/${fileName}`;

    const bucket = admin.storage().bucket();
    const destination = `${path}`;

    try {
      // Uploads a local file to the bucket
      const result = await bucket.upload(filePath, {
        destination: destination,
        metadata: {
          firebaseStorageDownloadTokens: Date.now(),
        }

      });

      tools.Logger.log(() => `${fileName} uploaded to ${path}`);

      // Permissions should be set on the cloud bucket level.
      // result[0].makePublic()
      return result[0].publicUrl();
    }
    catch (e) {

      tools.Logger.error(() => `[Upload Service] Upload PDF file failed: ${e}`);

    }

  }
}

import { HandlerTools } from '@iote/cqrs';
import { FunctionHandler, FunctionContext, RestResult } from '@ngfi/functions';

import { AssessmentProgress } from '@app/model/convs-mgr/micro-app/assessments';
import { EndUser } from '@app/model/convs-mgr/conversations/chats';
import { Organisation } from '@app/model/organisation';

import { QuestionsToHTML } from './questions-to-html';
import { FeedbackTemplateHTML } from './feedback-template';
import { AssessmentQuestion } from "@app/model/convs-mgr/conversations/assessments";

/**
 * Handler responsible for updating user progress in micro-apps via a webhook callback.
 */
export class GetFeedbackHTMLHandler extends FunctionHandler<{progress: AssessmentProgress, questions: AssessmentQuestion[]}, RestResult> 
{
  public async execute(req: {progress: AssessmentProgress, questions: AssessmentQuestion[]}, context: FunctionContext, tools: HandlerTools): Promise<any> 
  {
    tools.Logger.log(() => `Generating PDF for progress ${JSON.stringify(req)}`);

    try {
      const allQuestions = req.questions;
      
      const questionsHTML = QuestionsToHTML(allQuestions, req.progress);
      
      const endUserRepo$ = tools.getRepository<EndUser>(`orgs/${req.progress.orgId}/end-users`);
      const endUser = await endUserRepo$.getDocumentById(req.progress.endUserId);
      
      const orgRepo$ = tools.getRepository<Organisation>(`orgs`);
      const org = await orgRepo$.getDocumentById(req.progress.orgId);
      
      const headerDetails = {
        assessmentTitle: req.progress.title || '',
        logoURL: org.logoUrl || '',
        learnerName: endUser.variables['name'] || '',
        organisationName: org.name || ''
      };
      
      const formattedTitle = req.progress.title ? req.progress.title.split(' ').join('_') : '';
      const formattedName = endUser.variables['name'] ? endUser.variables['name'].split(' ').join('_') : '';

      // const pdfName = `${formattedName}_${formattedTitle}_${Date.now()}.pdf`;

      const feedbackHTML = FeedbackTemplateHTML(headerDetails, questionsHTML);

      if(feedbackHTML) {
        return { success: true, feedbackHTML };
      } else {
        throw `Error generating PDF HTML`;
      }
      // return assessmentProgressSrv.trackProgress(req);
    } catch (error) {
      tools.Logger.error(() => `[GetFeedbackPDFHandler].execute - Encountered error :: ${error}`);
      return { success: false, error: JSON.stringify(error) };
    }
  }

}

import { HandlerTools } from "@iote/cqrs";

import { EndUserDataService } from "@app/functions/bot-engine";
import { Actor, AssignableUnit } from "@app/private/model/convs-mgr/micro-apps/base";
import { CMI5LaunchData, LaunchModeTypes, ContextTemplate } from "@app/private/model/convs-mgr/micro-apps/cmi5";
import { LMSService, LearnerSessionService } from "@app/private/functions/micro-apps/base";

export class CMI5LMSService extends LMSService<CMI5LaunchData>
{

  constructor(private tools: HandlerTools) { super(); }

  async prepareForLaunch(orgId: string, endUserId: string, auId: string)
  {
    this.tools.Logger.log(() => '[LMSService].prepareForLaunch - Preparing to launch AU');

    const sessionService = new LearnerSessionService(this.tools);
    const sessionID = sessionService.generateSessionID();


    this.tools.Logger.log(() => '[LMSService].prepareForLaunch - Creating State Document...');
    await this.__createStateDocument(auId, orgId, endUserId, sessionID);

    this.tools.Logger.log(() => '[LMSService].prepareForLaunch - Initializing Session...');
    await sessionService.create(orgId, endUserId, auId, this.state);
  }

  protected async __createStateDocument(auId: string, orgId: string, endUserId: string, sessionID: string)
  {

    const courseId = auId.split('/')[0];

    const auRepo$ = this.tools.getRepository<AssignableUnit>(`orgs/${orgId}/course-packages/${courseId}/assignable-units`);

    const au = await auRepo$.getDocumentById(auId);

    this.state = {
      launchMode: LaunchModeTypes.Normal,
      moveOn: au.moveOn,
      masteryScore: au.masteryScore,
      contextTemplate: this.__createContextTemplate(au, sessionID),

      // The URL that the learner will be redirected to once the course is complete. This can be a deeplink or the whatsapp user url
      returnURL: this.__getReturnURL(endUserId)
    } as CMI5LaunchData;
  }

  public setAbandonedStatement()
  {
    this.tools.Logger.log(() => '[LMSService].sendAbandonedStatement - Setting abandoned statement...');
  }

  public createLaunchURL(firebaseURL: string, actor: Actor, endUserId: string, auId: string)
  {
    this.tools.Logger.log(() => '[LMSService].createLaunchURL - Creating launch URL for AU');

    const listenerURL = process.env.LISTENER_URL;
    const fetchTokenURL = process.env.FETCH_TOKEN_URL;

    const launchURL = `${firebaseURL}?endpoint=${listenerURL}&fetch=${fetchTokenURL}&actor=${JSON.stringify(actor)}&registration=${endUserId}&activityId=${auId}`;

    return launchURL;
  }

  public async getStateDocument(orgId: string, auId: string)
  {
    this.tools.Logger.log(() => '[LMSService].sendStateDocument - Sending state document to AU');

    const sessionService$ = new LearnerSessionService(this.tools);

    const session = await sessionService$.getSessionByAU(orgId, auId);

    return session.stateData;
  }

  public async getLearnerPreferences(orgId: string, endUserId: string)
  {
    this.tools.Logger.log(() => '[LMSService].sendLearnerPreferences - Sending learner preferences to AU');

    const endUserService = new EndUserDataService(this.tools, orgId);

    const endUser = await endUserService.getEndUser(endUserId);

    return endUser.learnerPreferences;
  }

  protected __createContextTemplate(au: AssignableUnit, sessionID: string, lang?: string): ContextTemplate
  {

    return {
      contextActivities: {
        grouping: [
          {
            objectType: 'Activity',
            id: au.id,
            definition: {
              name: {
                [lang || 'en-US']: au.title
              },
              description: {
                [lang || 'en-US']: au.description
              }
            }
          }
        ]
      },
      extensions: {
        'https://w3id.org/xapi/cmi5/context/extensions/sessionid': sessionID,
      }
    } as ContextTemplate;
  }

  private __getReturnURL(endUserId: string)
  {
    const platform = endUserId.split('_')[0];

    if (platform === 'w') {
      return `https://wa.me/${endUserId.split('_')[2]}`;
    } else {
      return "";
    }
  }
}
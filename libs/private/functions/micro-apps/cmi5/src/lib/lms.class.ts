import { HandlerTools } from "@iote/cqrs";

import { Actor, AssignableUnit, ContextTemplate, LMSLaunchData, LaunchModeTypes } from "@app/private/model/convs-mgr/micro-apps/cmi5";
import { EndUserDataService } from "@app/functions/bot-engine";

import { LearnerSessionService } from "./session.service";

export class LMSService
{

  private _state: LMSLaunchData;

  constructor(private tools: HandlerTools) { }

  public setState(state: LMSLaunchData)
  {
    this._state = state;
  }

  async prepareForLaunch(orgId: string, endUserId: string, auId: string)
  {
    this.tools.Logger.log(() => '[LMSService].prepareForLaunch - Preparing to launch AU');

    const sessionService = new LearnerSessionService(this.tools);
    const sessionID = sessionService.generateSessionID();


    this.tools.Logger.log(() => '[LMSService].prepareForLaunch - Creating State Document...');
    await this.__createStateDocument(auId, orgId, endUserId, sessionID);

    this.tools.Logger.log(() => '[LMSService].prepareForLaunch - Initializing Session...');
    await sessionService.create(orgId, endUserId, auId, this._state);
  }

  private async __createStateDocument(auId: string, orgId: string, endUserId: string, sessionID: string)
  {

    const courseId = auId.split('_')[0];

    const auRepo$ = this.tools.getRepository<AssignableUnit>(`orgs/${orgId}/course-packages/${courseId}/assignable-units`);

    const au = await auRepo$.getDocumentById(auId);

    this._state = {
      launchMode: LaunchModeTypes.Normal,
      moveOn: au.moveOn,
      masteryScore: au.masteryScore,
      contextTemplate: this.__createContextTemplate(au, sessionID),

      // The URL that the learner will be redirected to once the course is complete. This can be a deeplink or the whatsapp user url
      returnURL: this.__getReturnURL(endUserId)
    } as LMSLaunchData;
  }

  public sendAbandonedStatement()
  {
    this.tools.Logger.log(() => '[LMSService].sendAbandonedStatement - Sending abandoned statement to AU');
  }

  public createLaunchURL(firebaseURL: string, actor: Actor, endUserId: string, auId: string)
  {
    this.tools.Logger.log(() => '[LMSService].createLaunchURL - Creating launch URL for AU');

    // TODO: Move to .env
    const listenerURL = 'https://europe-west1-elewa-clm-test.cloudfunctions.net/lrslistener/'
    const fetchTokenURL = 'https://europe-west1-elewa-clm-test.cloudfunctions.net/fetchToken/'

    const launchURL = `${firebaseURL}?endpoint=${listenerURL}&fetch=${fetchTokenURL}&actor=${JSON.stringify(actor)}&registration=${endUserId}&activityId=${auId}`;

    return launchURL;
  }

  public getStateDocument()
  {
    this.tools.Logger.log(() => '[LMSService].sendStateDocument - Sending state document to AU');

    return this._state;
  }

  public async getLearnerPreferences(orgId: string, endUserId: string)
  {
    this.tools.Logger.log(() => '[LMSService].sendLearnerPreferences - Sending learner preferences to AU');

    const endUserService = new EndUserDataService(this.tools, orgId);

    const endUser = await endUserService.getEndUser(endUserId);

    return endUser.learnerPreferences;
  }

  private __createContextTemplate(au: AssignableUnit, sessionID: string, lang?: string): ContextTemplate
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
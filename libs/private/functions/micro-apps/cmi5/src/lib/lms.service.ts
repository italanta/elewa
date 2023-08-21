import { HandlerTools } from "@iote/cqrs";

import { EndUserDataService } from "@app/functions/bot-engine";
import { Actor, AssignableUnit, ContextTemplate } from "@app/private/model/convs-mgr/micro-apps/base";
import { CMI5LaunchData, LaunchModeTypes } from "@app/private/model/convs-mgr/micro-apps/cmi5";
import { LMSService, LearnerSessionService } from "@app/private/functions/micro-apps/base";

/**
 * cmi5 is a “profile” for using the xAPI specification with traditional learning 
 *    management (LMS) systems.
 * 
 * The cmi5 has a list of defined processes that should be followed as seen in the link below:
 * @see https://github.com/AICC/CMI-5_Spec_Current/blob/quartz/cmi5_spec.md#concept
 * 
 * These processes are defined in this Service
 */
export class CMI5Service extends LMSService<CMI5LaunchData>
{

  constructor(private tools: HandlerTools) { super(); }

  /**
   * Prepares the AU for launch as specified in the CMI5 spec:
   * 
   * @see https://aicc.github.io/CMI-5_Spec_Current/flows/lms-flow.html
   * 
   * Does the below:
   * 1.  Creates the state document - @see CMI5LaunchData from the AU configuration 
   *    extracted from the manifest and later stores it to the current session.
   * 
   * 2. Initializes a new session for the current AU and the learner
   */
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

  /**
   * Creates the state document - @see CMI5LaunchData from the AU configuration 
   *    and sets it to the state object.
   */
  protected async __createStateDocument(auId: string, orgId: string, endUserId: string, sessionID: string)
  { 
    // Get course Id from the AU Id
    const courseId = auId.split('/')[0];

    const auRepo$ = this.tools.getRepository<AssignableUnit>(`orgs/${orgId}/course-packages/${courseId}/assignable-units`);

    // Gets the current au configuration
    const au = await auRepo$.getDocumentById(auId);

    // Uses the current AU config to create the state (Launch Data)
    this.state = {
      launchMode: LaunchModeTypes.Normal,
      moveOn: au.moveOn,
      masteryScore: au.masteryScore,
      contextTemplate: this.__createContextTemplate(au, sessionID),

      // The URL that the learner will be redirected to once the course is complete. This can be a deeplink or the whatsapp user url
      returnURL: this.__getReturnURL(endUserId)
    } as CMI5LaunchData;
  }

  /** Should be used if we can detect that the learner has abanded the session */
  public setAbandonedStatement()
  {
    this.tools.Logger.log(() => '[LMSService].sendAbandonedStatement - Setting abandoned statement...');
  }

  /** Creates the URL used to launch an AU as specified in the CMI5 spec:
   * 
   * @see https://github.com/AICC/CMI-5_Spec_Current/blob/quartz/cmi5_spec.md#content_launch
   */
  public createLaunchURL(auLocationURL: string, actor: Actor, endUserId: string, auId: string)
  {
    this.tools.Logger.log(() => '[LMSService].createLaunchURL - Creating launch URL for AU');

    // The base URL to which the AU will send xAPI requests to
    const listenerURL = process.env.LISTENER_URL;

    // The URL to which the AU will request the access token
    const fetchTokenURL = process.env.FETCH_TOKEN_URL;

    // The resulting launch URL
    const launchURL = `${auLocationURL}?endpoint=${listenerURL}&fetch=${fetchTokenURL}&actor=${JSON.stringify(actor)}&registration=${endUserId}&activityId=${auId}`;

    return launchURL;
  }

  /** Gets the state document(launchData) of the AU in the current session */
  public async getStateDocument(orgId: string, auId: string)
  {
    this.tools.Logger.log(() => '[LMSService].sendStateDocument - Getting the current state document...');

    const sessionService$ = new LearnerSessionService(this.tools);

    const session = await sessionService$.getSessionByAU(orgId, auId);

    return session.stateData;
  }

  /**  */
  public async getLearnerPreferences(orgId: string, endUserId: string)
  {
    this.tools.Logger.log(() => '[LMSService].sendLearnerPreferences - Sending learner preferences to AU');

    const endUserService = new EndUserDataService(this.tools, orgId);

    const endUser = await endUserService.getEndUser(endUserId);

    return endUser.learnerPreferences;
  }

  /** 
   * Creates the Template to be followed by the AU when sending xAPI statements
   * 
   * @see ContextTemplate
   */
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

  /** 
   * Gets the URL to which we will redirect the user upon finishing the AU
   * 
   * In this case we can decide to take them back to the messaging platfrom 
   *    or TODO: redirect them to the next AU in the course
   */
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
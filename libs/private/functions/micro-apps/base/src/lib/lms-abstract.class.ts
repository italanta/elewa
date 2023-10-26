import { LearnerPreferences } from "@app/model/convs-mgr/conversations/chats";

import { Actor, AssignableUnit, ContextTemplate } from "@app/private/model/convs-mgr/micro-apps/base";

/**
 * The cmi5 has a list of defined processes that should be followed as seen in the link below:
 * @see https://github.com/AICC/CMI-5_Spec_Current/blob/quartz/cmi5_spec.md#concept
 * 
 * These class defines the methods for managing the LMS side of the xAPI specification
 */
export abstract class LMSService<T> {
  protected state: T;
  constructor() { }

  public setState(state: T)
  {
    this.state = state;
  }

  public getState() 
  {
    return this.state;
  }

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
  public abstract prepareForLaunch(orgId: string, endUserId: string, auId: string): void;

  /** Creates the URL used to launch an AU as specified in the CMI5 spec:
   * 
   * @see https://github.com/AICC/CMI-5_Spec_Current/blob/quartz/cmi5_spec.md#content_launch
   */
  public abstract createLaunchURL(firebaseURL: string, actor: Actor, endUserId: string, auId: string): string;

  /** Gets the audio and language preferences of the learner if they have been configured 
   * 
   * The documentation allows us to send 403 forbidden if the preferences do not exist and the 
   *  AU will still continue.
   * 
   * @see https://github.com/AICC/CMI-5_Spec_Current/blob/quartz/cmi5_spec.md#xapi_agent_profile
  */
  public abstract getLearnerPreferences(orgId: string, endUserId: string): Promise<LearnerPreferences>;

  /** 
   * Creates the Template to be followed by the AU when sending xAPI statements
   * 
   * @see ContextTemplate
   */
  protected abstract __createContextTemplate(au: AssignableUnit, sessionID: string, lang?: string): ContextTemplate;

  /**
   * Creates the state document - @see CMI5LaunchData from the AU configuration 
   *    and sets it to the state object.
   */
  protected abstract __createStateDocument(auId: string, orgId: string, endUserId: string, sessionID: string): void;
}
import { LMSLaunchData, ContextTemplate, MoveOnTypes } from "@app/private/model/convs-mgr/micro-apps/base";


/**
 * LaunchData contains the configuration and rules of a particular 
 *    Assignable Unit. 
 * 
 * @see https://github.com/AICC/CMI-5_Spec_Current/blob/quartz/cmi5_spec.md#xapi_state
 * 
 * Immediately an AU(Assignable Unit) is launched, it will request for two things:
 *  - The authorization token
 *  - The Launch Data - also referred to as the 'state'
 * 
 * This configuration is extracted from the manifest. Each AU in the manifest has an xml tag
 *  and the configuration is defined in the tag e.g. <au masteryScore = 0.9>
 * 
 * Therefore all the configuration defined here can configured on a platform such as Articulate before
 *   exporting the course package.
 */
export interface CMI5LaunchData extends LMSLaunchData
{
  /** The launch mode determined by the LMS.
   * 
   * In this case, we determine how we will launch the AU.
   * 
   * @see LaunchModeTypes
   */
  launchMode: LaunchModeTypes;

  /** Provides the criteria that should be met by the learner upon 
   * finishing the AU.
   * 
   * @see https://github.com/AICC/CMI-5_Spec_Current/blob/quartz/cmi5_spec.md#xapi_state_properties_moveOn
   */
  moveOn: MoveOnTypes;

  /** Used by the LMS when launching the AU if the LMS requires the AU 
   *    (in a web-browser environment) to redirect the learner when he 
   *        or she exits the AU. */
  returnURL: string;

  /** This is required and defines the structure of subsequent requests from
   *    the AU.
   */
  contextTemplate: ContextTemplate;

  /** 
   * Indicates the minimum score that a learner must achieve to pass a course 
   *      or an activity
   * 
   * The masteryScore is a scaled, decimal value between 0 and 1 
   * (inclusive) with up to 4 decimal places of precision. 
   * 
   * The LMS MUST include a masteryScore in the LMS.LaunchData State document 
   *    if the masteryScore was defined by the course designer in the Course Structure
   * */
  masteryScore?: number;
}

  /**
   * The launch mode determined by the LMS.
   * */
export enum LaunchModeTypes
{
  /** Indicates to the AU that satisfaction-related data MUST be recorded in the 
   *    LMS using xAPI statements. 
   * */
  Normal = 'Normal',

  /**
   * Indicates to the AU that satisfaction-related data MUST NOT be recorded in the LMS 
   *    using xAPI statements. When Browse mode is used, the AU SHOULD provide a user experience that 
   *        allows the user to "look around" without judgement.
   * 
   * This can be used for testing/reviewing the content before going live
   */
  Browse = 'Browse',
  
  /**
   *  When Review mode is used, the AU SHOULD provide a user experience that allows the user to 
   *    "revisit/review" already completed material.
   */
  Review = 'Review',
}
import { StoryBlock } from "@app/model/convs-mgr/stories/blocks/main";

/** High level MicroApp definition */
export interface MicroAppBlock extends StoryBlock 
{
  /** will be used to create the url */
  appId: string;
  /** The name of the micro app. Will be used as the link display text */
  appName: string;
  /** Additional data for the microApp to run */
  configs: MicroAppConfig
  /** Comprehensive micro-app data  */
  appStatus?: MicroAppStatus 
}

/** Provides the criteria that should be met by the learner upon 
 *    finishing the micro-app.
 */
export enum PassCriteriaTypes {
  /**Percentage set to mark a task as done */
  Completed = 'completed',
  /** A task is done, and test scores meet the pass criteria  */
  CompletedAndPassed = 'completedAndPassed',
  /** Conditions not defined / strict */
  NotApplicable = 'notApplicable',
  /** Test scores meet the pass criteria */
  Passed = 'passed',
  /** Test scores do not meet the pass criteria */
  Failed = 'failed',
}

/**
 * The type of Micro App. It can be an assessment, game, lesson and so on. 
 */
export enum MicroAppTypes {
  /** Content to study */
  Course = 1,
  /** Tests to take */
  Assessment = 5,
  /** Any other usecase */
  Custom = 10
}

/** 
 * Tracks the status of a Micro app through out a learner's engagement with it
 * @currentSection
 * @config
 * @status
 * Assessment status will extend this interface */
export interface MicroAppStatus {
  currentSection: MicroAppSectionTypes;
  config: MicroAppConfig;
  status: MicroAppStatusTypes;
}

export interface MicroAppConfig {
  passCriteria: PassCriteriaTypes;
  
  type: MicroAppTypes;
  
  progressUrl?: string;
  
  /** URL to be called after the micro-app is done. The payload will include the user id and their data from the micro app e.g. Assessment results  */
  completeWebhookUrl?: string;
}

/**  At what state is a Micro app in */
export enum MicroAppStatusTypes {
  /** user has clicked the micro-app link */
  Launched = "launched",
  /** A user has started consuming the course content, by clicking the start button */
  Started = "started",
  /** A learner has finished with all of the content */
  Completed = "completed", 
  /** A user started interacting with the content and left it unfinished */
  Abandoned = "abandoned", 
  /** If the micro-app progress has been forcefully marked as completed by the content creator */
  Waived = "waived", 
  /** If the micro-app progress has been brought to an end */
  Terminated = "terminated"
}

/** Parts of a a Micro-app screen */
export enum MicroAppSectionTypes {
  /** Start page / landing page */
  Start = 0,
  /** Main content consumption section */
  Main = 1,
  /** A user has finished their course and is being redirected back to  the messaging platform */
  Redirect = 2
}

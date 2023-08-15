import { ContextTemplate } from "./context-template.interface";

/**
 * The LaunchData for the specific AU
 */
export interface LMSLaunchData {
  /** Set by LMS */
  launchMode: LaunchModeTypes;

  /** Provided by AU */
  moveOn: MoveOnTypes;

  /** Provided by LMS */
  returnURL: string;

  /** Provided by LMS*/
  contextTemplate: ContextTemplate;

  /** The masteryScore is a scaled, decimal value between 0 and 1 
   * (inclusive) with up to 4 decimal places of precision. 
   * 
   * Provided by AU
   * */
  masteryScore?: number;
}

export enum LaunchModeTypes {
  Normal = 'normal',
  Review = 'review',
  Browse = 'browse'
}

export enum MoveOnTypes {
  Completed = 'completed',
  CompletedAndPassed = 'completedAndPassed',
  CompletedOrPassed = 'completedOrPassed',
  NotApplicable = 'notApplicable',
  Passed = 'passed',
}

export enum LaunchMethodTypes {
  OwnWindow = 'ownWindow',
  AnyWindow = 'anyWindow'
}
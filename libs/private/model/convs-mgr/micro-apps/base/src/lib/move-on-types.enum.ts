/** Provides the criteria that should be met by the learner upon 
 *    finishing the AU.
 * 
 * @see https://github.com/AICC/CMI-5_Spec_Current/blob/quartz/cmi5_spec.md#xapi_state_properties_moveOn
 */
export enum MoveOnTypes
{
  Completed = 'completed',
  CompletedAndPassed = 'completedAndPassed',
  CompletedOrPassed = 'completedOrPassed',
  NotApplicable = 'notApplicable',
  Passed = 'passed',
}
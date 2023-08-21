import { HandlerTools } from "@iote/cqrs";

import { AUService } from "@app/private/functions/micro-apps/base";
import { xAPIStatement, CourseParticipation, CourseStatus, AUStatusTypes, ContextTemplate, AUStatus } from "@app/private/model/convs-mgr/micro-apps/base";
import { LearnerSessionService } from "@app/private/functions/micro-apps/base";

/**
 * An Assignable Unit (AU) is a learning content presentation launched from an LMS. 
 *  The AU is the unit of tracking and management. The AU collects data on the learner 
 *      and sends it to the LMS. @see AssignableUnit
 * 
 * After the Learning Activity(AU) is launched, the AU will begin sending xAPI statements 
 *  to us(the LMS) on the learners progress. The below service receives these xAPI statements
 *    and records the learners progress
 */
export class CMI5AUService extends AUService
{
  constructor(private tools: HandlerTools) { super(tools); }

  /** Updates the learner's progress based on  the verb on the xAPI statement sent by the AU */
  async updateProgress(statement: xAPIStatement<ContextTemplate>, lang?: string)
  {
    // Gets the verb from the xAPI statement object
    const verb = this.__getVerb(statement, lang);

    // Gets the current session ID the AU belongs to
    const sessionID = statement.extensions['https://w3id.org/xapi/cmi5/context/extensions/sessionid'];

    // Gets the organisation ID the learner belongs to
    const orgId = statement.actor.account.organisation;

    // Gets the learner registration id which is the end user id in our case
    const endUserId = statement.context.registration;

    // Gets the ID of the Learning Actiity the learner is interacting with
    const auId = statement.object.id;

    // Gets the course ID from the AU ID
    const courseId = auId.split("/")[0];

    const sessionService = new LearnerSessionService(this.tools);

    // Retrirve the current session details
    const currentSession = await sessionService.getSession(orgId, auId, sessionID);

    // Update the status of the AU depending on the verb. 
    //  The first AU in the array is the current one.
    currentSession.activityStatus[0].status = verb as AUStatusTypes;

    // If we have a result, update the AU with the score
    if (statement.result) {
      currentSession.activityStatus[0].score = statement.result.score.scaled;
    }

    if (currentSession) {
      if (this.__isSuccessful(verb)) {
        // Update the AU with the completion date
        currentSession.activityStatus[0].completionDate = new Date();

        // If the AU is completed, update the end user with the course status
        //  and return the id of the next AU.
        // TODO: Handle the case where the AU is not the last one
        const nextUnit = await this.__auCompleted(orgId, courseId, endUserId, currentSession.activityStatus);

        if (this.isCourseComplete) {
          // Update the session with the completion date
          currentSession.completionDate = new Date();
        }

        // Update the current session with the learner progress
        await sessionService.update(currentSession, orgId, auId);
      } else {
        await sessionService.update(currentSession, orgId, auId);
      }
    } else {
      this.tools.Logger.error(() => `Session ${sessionID} not found for ${orgId} and ${auId}`);
    }
  }

  /**
   * In the case that an AU is completed, we check if it is the last learning activity in the course
   *   and mark the course as completed or mark the AU as completed and return the Id of the next AU.
   * 
   * TODO: Add logic for when a learner has completed and has failed or scored below the mastery score.
   */
  protected async __auCompleted(orgId: string, courseId: string, endUserId: string, auStatus: AUStatus[])
  {
    const courseParticipation$ = this.tools.getRepository<CourseParticipation>(`orgs/${orgId}/end-users/${endUserId}/courses`);

    // Get current AU Details to check if this is the last AU of the course
    const nextUnit = (await this.__getAUDetails(courseId, orgId, courseId)).nextUnit;

    // Check if the course is complete and there are no AUs remaining
    this.isCourseComplete = this.__checkCourseCompletion(auStatus) && !nextUnit;

    // Get the current course participation details
    const currentParticipation = await courseParticipation$.getDocumentById(courseId);

    // Update the course participation status with the new update
    currentParticipation.activityStatus[0] = auStatus[0];

    // If there is no registered course participation for the learner, we initialize a
    //  new one
    if (currentParticipation) {
      // If the course is complete, record the progress in the course participation
      // Otherwise, only update the auStatus
      if (this.isCourseComplete) {
        currentParticipation.status = CourseStatus.Completed;
        currentParticipation.completedOn = new Date();
        await courseParticipation$.update(currentParticipation);
      } else {
        await courseParticipation$.update(currentParticipation);
      }
    } else {
      this.tools.Logger.log(() => `Course ${courseId} not found for ${endUserId}. Creating a new one...`);

      const newParticipation: CourseParticipation = {
        id: courseId,
        status: CourseStatus.InProgress,
        activityStatus: auStatus,
        startedOn: new Date()
      };

      await courseParticipation$.write(newParticipation, courseId);
    }

    return nextUnit;
  }

  /**
   * Checks if all AUs in the course have been completed successfuly without
   *  any abandonment or termination
   */
  private __checkCourseCompletion(auStatus: AUStatus[])
  {
    // Check if all AUs have been satisfied/completed without any abandonments or termination
    const allAUsCompleted = auStatus.every(au => this.__isSuccessful(au.status));

    return allAUsCompleted;
  }
}
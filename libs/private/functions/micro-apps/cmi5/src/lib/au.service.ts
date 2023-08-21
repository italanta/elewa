import { HandlerTools } from "@iote/cqrs";

import { xAPIStatement, AUStatus, CourseParticipation, CourseStatus, AssignableUnit, AUStatusTypes } from "@app/private/model/convs-mgr/micro-apps/base";

import { LearnerSessionService } from "./session.service";

export class AUService
{
  private isCourseComplete: boolean;

  constructor(private tools: HandlerTools) { }

  private __getVerb(statement: xAPIStatement, lang?: string)
  {
    return statement.verb.display[lang || "en-US"];
  }

  async updateProgress(statement: xAPIStatement, lang?: string)
  {
    const verb = this.__getVerb(statement, lang);

    const sessionID = statement.extensions['https://w3id.org/xapi/cmi5/context/extensions/sessionid'];
    const orgId = statement.actor.account.organisation;
    const endUserId = statement.context.registration;
    const auId = statement.object.id;
    const courseId = auId.split("/")[0];

    const sessionService = new LearnerSessionService(this.tools);

    const currentSession = await sessionService.getSession(orgId, auId, sessionID);

    // Update the status of the AU depending on the verb. 
    //  The first AU in the array is the current one.
    currentSession.auStatus[0].status = verb as AUStatusTypes;

    // If we have a result, update the AU with the score
    if (statement.result) {
      currentSession.auStatus[0].score = statement.result.score.scaled;
    }

    if (currentSession) {
      if (this.__isSuccessful(verb)) {
        // Update the AU with the completion date
        currentSession.auStatus[0].completionDate = new Date();

        // If the AU is completed, update the end user with the course status
        // TODO: Handle the case where the AU is not the last one
        const nextUnit = await this.__auCompleted(orgId, courseId, endUserId, currentSession.auStatus);

        if(this.isCourseComplete) { 
          // Update the session with the completion date
          currentSession.completionDate = new Date();
        }

        await sessionService.update(currentSession, orgId, auId);
      } else {
        await sessionService.update(currentSession, orgId, auId);
      }
    } else {
      this.tools.Logger.error(() => `Session ${sessionID} not found for ${orgId} and ${auId}`);
    }
  }

  private async __auCompleted(orgId: string, courseId: string, endUserId: string, auStatus: AUStatus[])
  {
    const courseParticipation$ = this.tools.getRepository<CourseParticipation>(`orgs/${orgId}/end-users/${endUserId}/courses`);
    
    // Get current AU Details to check if this is the last AU of the course
    const nextUnit = (await this.__getAUDetails(courseId, orgId, courseId)).nextUnit;
    
    // Check if the course is complete and there are no AUs remaining
    this.isCourseComplete = this.__checkCourseCompletion(auStatus) && !nextUnit;

    const currentParticipation = await courseParticipation$.getDocumentById(courseId);

    currentParticipation.auStatus[0] = auStatus[0];

    if (currentParticipation) {
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
        auStatus: auStatus,
        startedOn: new Date()
      };

      await courseParticipation$.write(newParticipation, courseId);
    }

    return nextUnit;
  }

  private __getAUDetails(auId: string, orgId: string, courseId: string)
  {
    const assignableUnit$ = this.tools.getRepository<AssignableUnit>(`orgs/${orgId}/courses/${courseId}/assignable-units`);

    return assignableUnit$.getDocumentById(auId);
  }

  private __isSuccessful(verb: string): boolean
  {
    return verb === AUStatusTypes.Completed || verb === AUStatusTypes.Passed || verb === AUStatusTypes.Failed || verb === AUStatusTypes.Completed;
  }

  private __checkCourseCompletion(auStatus: AUStatus[])
  {
    // Check if all AUs have been satisfied/completed without any abandonments or termination
    const allAUsCompleted = auStatus.every(au => this.__isSuccessful(au.status));

    return allAUsCompleted;
  }
}
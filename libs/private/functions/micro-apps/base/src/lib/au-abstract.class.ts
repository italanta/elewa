import { HandlerTools } from "@iote/cqrs";

import { AUStatus, AUStatusTypes, xAPIStatement, ContextTemplate, AssignableUnit } from "@app/private/model/convs-mgr/micro-apps/base";

/**
 * An Assignable Unit (AU) is a learning content presentation launched from an LMS. 
 *  The AU is the unit of tracking and management. The AU collects data on the learner 
 *      and sends it to the LMS. @see AssignableUnit
 * 
 * After the Learning Activity(AU) is launched, the AU will begin sending xAPI statements 
 *  to us(the LMS) on the learners progress. The below service receives these xAPI statements
 *    and records the learners progress
 */
export abstract class AUService
{
  protected isCourseComplete: boolean;
  private _tools: HandlerTools;

  constructor(tools: HandlerTools) { this._tools = tools;}

  /** 
   * A verb defines the action being done by the Actor within the Activity 
   *    within a Statement
   * 
   * Gets the verb from the xAPI statement object
   * 
   * @see xAPIStatement
   */
  protected __getVerb(statement: xAPIStatement<ContextTemplate>, lang?: string)
  {
    return statement.verb.display[lang || "en-US"];
  }

  /** Gets the AU configuration which was extracted from the manifest */
  protected __getAUDetails(auId: string, orgId: string, courseId: string)
  {
    const assignableUnit$ = this._tools.getRepository<AssignableUnit>(`orgs/${orgId}/courses/${courseId}/assignable-units`);

    return assignableUnit$.getDocumentById(auId);
  }

  /**
   * If an AU is not terminated, abandoned or skipped, then we consider it successful
   */
  protected __isSuccessful(verb: string): boolean
  {
    return verb === AUStatusTypes.Completed || verb === AUStatusTypes.Passed || verb === AUStatusTypes.Failed || verb === AUStatusTypes.Completed;
  }

  /**
   * Updates the progress of the learner in the AU from the xAPI statement sent to us (LMS)
   */
  public abstract updateProgress(statement: xAPIStatement<ContextTemplate>, lang?: string): void;

  /**
   * In the case that an AU is completed, we check if it is the last learning activity in the course
   *   and mark the course as completed or mark the AU as completed and return the Id of the next AU.
   */
  protected abstract __auCompleted(orgId: string, courseId: string, endUserId: string, auStatus: AUStatus[]): Promise<string>;
}
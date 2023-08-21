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

  protected __getVerb(statement: xAPIStatement<ContextTemplate>, lang?: string)
  {
    return statement.verb.display[lang || "en-US"];
  }

  protected __getAUDetails(auId: string, orgId: string, courseId: string)
  {
    const assignableUnit$ = this._tools.getRepository<AssignableUnit>(`orgs/${orgId}/courses/${courseId}/assignable-units`);

    return assignableUnit$.getDocumentById(auId);
  }

  protected __isSuccessful(verb: string): boolean
  {
    return verb === AUStatusTypes.Completed || verb === AUStatusTypes.Passed || verb === AUStatusTypes.Failed || verb === AUStatusTypes.Completed;
  }

  public abstract updateProgress(statement: xAPIStatement<ContextTemplate>, lang?: string): void;

  protected abstract __auCompleted(orgId: string, courseId: string, endUserId: string, auStatus: AUStatus[]): Promise<string>;
}
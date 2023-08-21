import { HandlerTools } from "@iote/cqrs";

import { AUStatus, AUStatusTypes, AssignableUnit, xAPIStatement } from "@app/private/model/convs-mgr/micro-apps/base";

export abstract class AUService
{
  protected isCourseComplete: boolean;
  private _tools: HandlerTools;

  constructor(tools: HandlerTools) { this._tools = tools;}

  protected __getVerb(statement: xAPIStatement, lang?: string)
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

  public abstract updateProgress(statement: xAPIStatement, lang?: string): void;

  protected abstract __auCompleted(orgId: string, courseId: string, endUserId: string, auStatus: AUStatus[]): Promise<string>;
}
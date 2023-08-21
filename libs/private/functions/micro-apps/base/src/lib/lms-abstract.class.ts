import { LearnerPreferences } from "@app/model/convs-mgr/conversations/chats";

import { Actor, AssignableUnit, ContextTemplate } from "@app/private/model/convs-mgr/micro-apps/base";


/** Defines the methods for managing the LMS side of the xAPI specification  */
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

  public abstract prepareForLaunch(orgId: string, endUserId: string, auId: string): void;

  public abstract createLaunchURL(firebaseURL: string, actor: Actor, endUserId: string, auId: string): string;

  public abstract getLearnerPreferences(orgId: string, endUserId: string): Promise<LearnerPreferences>;

  protected abstract __createContextTemplate(au: AssignableUnit, sessionID: string, lang?: string): ContextTemplate;

  protected abstract __createStateDocument(auId: string, orgId: string, endUserId: string, sessionID: string): void;
}
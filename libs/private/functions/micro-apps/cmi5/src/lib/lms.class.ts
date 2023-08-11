import { HandlerTools } from "@iote/cqrs";

export class LMSService {
  private _state: any;

  constructor(private tools: HandlerTools) { }

  public getState() {
    return this._state;
  }

  public setState(state: any) { 
    this._state = state;
  }

  public sendLaunchStatement() { 
    this.tools.Logger.log(() => '[LMSService].sendLaunchStatement - Sending launch statement to AU');
  }

  public sendAbandonedStatement() { 
    this.tools.Logger.log(() => '[LMSService].sendAbandonedStatement - Sending abandoned statement to AU');
  }

  public createLaunchURL() { 
    this.tools.Logger.log(() => '[LMSService].createLaunchURL - Creating launch URL for AU');
  }

  public sendStateDocument() {
    this.tools.Logger.log(() => '[LMSService].sendStateDocument - Sending state document to AU');
  }

  public sendLearnerPreferences() {
    this.tools.Logger.log(() => '[LMSService].sendLearnerPreferences - Sending learner preferences to AU');
  }
}
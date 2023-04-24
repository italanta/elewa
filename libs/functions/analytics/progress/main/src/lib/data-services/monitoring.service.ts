import { HandlerTools } from '@iote/cqrs';

import { BotDataService } from '@app/functions/bot-engine';

/**
 * monitoring and eval data service
 */
 export class MonitoringAndEvaluationService extends BotDataService<any>{
  private _docPath: string;
  tools: HandlerTools;

  constructor(tools: HandlerTools, orgId: string) 
  {
    super(tools);
    this.tools = tools;
    this._init(orgId);
  }

  protected _init(orgId: string): void 
  {
    this._docPath = `orgs/${orgId}/monitoring`;
  }

  async createNewMilestone(time:Date, measurements: any[], groupedMeasurements: any[], Milestoneid: string)
  {
    const newMilestone: any = {
      time,
      measurements,
      groupedMeasurements,
    };

    const milestone = await this.createDocument(newMilestone, this._docPath, Milestoneid);
    return milestone;
  }

  async getMilestone(Milestoneid: string) {
    return this.getDocumentById(Milestoneid, this._docPath)
  }
}

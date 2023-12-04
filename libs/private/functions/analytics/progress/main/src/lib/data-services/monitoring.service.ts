import { HandlerTools } from '@iote/cqrs';

import { BotDataService } from '@app/functions/bot-engine';
import { 
  GroupProgressModel, 
  UsersProgressMilestone, 
  GroupedProgressMilestone, 
  EnrolledUserCount,
  CompletionRateProgress
} from '@app/model/analytics/group-based/progress';

/**
 * monitoring and eval data service
 */
export class MonitoringAndEvaluationService extends BotDataService<GroupProgressModel>{
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

  async createNewMilestone(
    time:number, measurements: UsersProgressMilestone[], 
    groupedMeasurements: GroupedProgressMilestone[], todaysEnrolledUsersCount: EnrolledUserCount, 
    progressCompletion: CompletionRateProgress, Milestoneid: string
  )
  {
    const newMilestone: GroupProgressModel = {
      time,
      measurements,
      groupedMeasurements,
      todaysEnrolledUsersCount,
      progressCompletion,
    };

    const milestone = await this.writeDocument(newMilestone, this._docPath, Milestoneid);
    return milestone;
  }

  async getMilestone(Milestoneid: string) {
    return this.getDocumentById(Milestoneid, this._docPath)
  }
}

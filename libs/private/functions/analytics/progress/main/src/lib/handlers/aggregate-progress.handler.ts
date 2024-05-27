import { HandlerTools } from '@iote/cqrs';
import { FunctionHandler, HttpsContext } from '@ngfi/functions';

import { AnalyticsConfig, GroupProgressModel } from '@app/model/analytics/group-based/progress';
import { Query } from '@ngfi/firestore-qbuilder';
/**
 * Function which calculates progress of a given participant based on the stories they have completed.
 */
export class AggregateProgressHandler extends FunctionHandler<any, any>
{
  /**
   * Calculate progress of a given participant based on the stories they have completed.
   * 
   * @param cmd - Command with participant ID and an optional interval at which to measure - defaults to current date.
   */
  public async execute(cmd: any, context: HttpsContext, tools: HandlerTools) 
  {
    // Get the current progress from all the orgs

    //1. get OrgIds from analytics config
    const analyticsRepo$ = tools.getRepository<AnalyticsConfig>(`analytics`);

    const aggregatedAnalyticsRepo$ = tools.getRepository<GroupProgressModel>(`aggregated-analytics`);

    const config = await analyticsRepo$.getDocumentById('config');

    if (!config && !config.orgIds) {
      tools.Logger.error(() => `[AggregateProgressHandler].execute - Config missing, No orgs to aggregate data`);
    } else {

      for(const orgId of config.orgIds) {
        const progress = await this._getLatestProgress(tools, orgId);
        tools.Logger.log(() => `[AggregateProgressHandler].execute - Org:${orgId} - Progress: ${JSON.stringify(progress)}`);
        if(!progress) continue;

        progress.orgId = orgId;
        const id = `${progress.id}_${orgId}`;
        
        await aggregatedAnalyticsRepo$.write(progress, id);
      }
      tools.Logger.log(() => `[AggregateProgressHandler].execute - Aggregating progress done`);
    }
  }

  private async _getLatestProgress(tools: HandlerTools, orgId: string) {
    const monitoringRepo$ = tools.getRepository<GroupProgressModel>(`orgs/${orgId}/monitoring`);

    const latestProgress = await monitoringRepo$.getDocuments(new Query().orderBy('createdOn', 'desc'));

    return latestProgress[0]
  }
}

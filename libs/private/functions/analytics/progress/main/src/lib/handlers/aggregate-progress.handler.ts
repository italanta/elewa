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
      tools.Logger.error(() => `[measureGroupProgressHandler].execute - Config missing, No orgs to aggregate data`);
    } else {
      const latestProgress = config.orgIds.map(async (orgId)=> {
        const progress = await this._getLatestProgress(tools, orgId);
        progress.orgId = orgId;
        const id = `${progress.id}_${orgId}`;
        tools.Logger.log(() => `[measureGroupProgressHandler].execute - Org:${orgId} - Progress: ${JSON.stringify(progress)}`);
        
        await aggregatedAnalyticsRepo$.write(progress, id);
        
        return progress;
      })
      
      await Promise.all(latestProgress);
      tools.Logger.log(() => `[measureGroupProgressHandler].execute - Aggregating progress done`);
    }
  }

  private async _getLatestProgress(tools: HandlerTools, orgId: string) {
    const monitoringRepo$ = tools.getRepository<GroupProgressModel>(`orgs/${orgId}/monitoring`);

    const latestProgress = await monitoringRepo$.getDocuments(new Query().orderBy('createdOn', 'desc'))

    return latestProgress[0]
  }
}

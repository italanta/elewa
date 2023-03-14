import { Cursor } from '@app/model/convs-mgr/conversations/admin/system';
import { HandlerTools } from '@iote/cqrs';

import { FunctionHandler, RestResult, HttpsContext, RestResult200 } from '@ngfi/functions';
import { CursorDataService } from '../services/data-services/cursor.service';
import { EndUserDataService } from '../services/data-services/end-user.service';

export class MilestonesTrackerHandler extends FunctionHandler<{}, RestResult | any>
{
  orgId: string = 'yXyu2Rn5FJbwfZVAl6w6agHNW4I2';
  public async execute(outgoingPayload: {}, context: HttpsContext, tools: HandlerTools) 
  {
    try {
      // Go though user documents and collect the latest cursor
      const endUserService = new EndUserDataService(tools, this.orgId);

      const cursorDataService = new CursorDataService(tools);

      const allEndUsers =  await endUserService.getDocuments(`orgs/${this.orgId}/end-users`);

      const milestoneData = allEndUsers.map(async (user) => {
        const docPath = `orgs/${this.orgId}/end-users/${user.id}/variables`;

        const valuesRepo$ = tools.getRepository<any>(docPath);
        // Name of the user
        const variableValues  =  await valuesRepo$.getDocumentById('values');

        const name = variableValues ? variableValues.name || "No name" : 'No name';

        const latestCursor = await cursorDataService.getLatestCursor(user.id, this.orgId) as Cursor

        let completedChapter = "Onboarding"

        if(latestCursor.parentStack && latestCursor.parentStack.length > 1){

          // ---- Change this later ------------ //
          // const completedChapterId = latestCursor.parentStack[1].storyId;
          const completedChapterId = latestCursor.parentStack[latestCursor.parentStack.length - 2].storyId;

          const story = await tools.getRepository<any>(`orgs/${this.orgId}/stories`).getDocumentById(completedChapterId);

          completedChapter = story.name ? story.name : 'No story name';
        }

        const storyId = latestCursor.position.storyId

        const story = await tools.getRepository<any>(`orgs/${this.orgId}/stories`).getDocumentById(storyId);

        const storyName = story.name ? story.name : 'No story name';

        return { date: new Date().toDateString(), name, completedChapter,currentChapter: storyName, phoneNumber: user.phoneNumber };
      });

      const data = await Promise.all(milestoneData);

      return data
    } catch (error) {
      tools.Logger.error(() => `[MilestonesTrackerHandler].execute - Encountered an error ${error}`);

      return { error: error.message, status: 500} as RestResult
    }
  }
}

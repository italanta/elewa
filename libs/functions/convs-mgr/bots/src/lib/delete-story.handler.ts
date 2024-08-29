import * as admin from 'firebase-admin';

import { HandlerTools } from '@iote/cqrs';
import { FunctionHandler, FunctionContext, RestResult } from '@ngfi/functions';
import { BotModule } from '@app/model/convs-mgr/bot-modules';
import { Story } from '@app/model/convs-mgr/stories/main';

/**
 * Handler to delete a story and its subsequent blocks and connections.
 */
export class DeleteStoryHandler extends FunctionHandler<{ storyId: string, orgId: string; }, RestResult>
{

  public async execute(req: { storyId: string, orgId: string; }, context: FunctionContext, tools: HandlerTools): Promise<RestResult>
  {
    try {
      const modulesRepo$ = tools.getRepository<BotModule>(`orgs/${req.orgId}/modules`);
      const storiesRepo$ = tools.getRepository<Story>(`orgs/${req.orgId}/stories`);

      const story = await storiesRepo$.getDocumentById(req.storyId);

      const module = await modulesRepo$.getDocumentById(story.parentModule);

      module.stories = module.stories.filter((stories)=> stories !== req.storyId);

      const ref = admin.firestore().doc(`orgs/${req.orgId}/stories/${req.storyId}`);

      // Recursively delete the story and it's subcollections (blocks/connections)
      await admin.firestore().recursiveDelete(ref);

      await modulesRepo$.update(module);

      tools.Logger.log(() => `[DeleteStoryHandler].execute - Story delete successful :: ${req.storyId}`);

      return {
        status: 200,
        message: "Story delete successful",
      } as RestResult;

    } catch (error) {
      tools.Logger.error(() => `[DeleteStoryHandler].execute - Error :: ${error}`);

      return {
        status: 500,
        message: "Failed to delete Story",
        data: error,
      } as RestResult;

    }

  }
}

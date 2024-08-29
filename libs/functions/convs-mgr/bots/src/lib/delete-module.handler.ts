import * as admin from 'firebase-admin';

import { HandlerTools } from '@iote/cqrs';
import { Query } from '@ngfi/firestore-qbuilder';
import { FunctionHandler, FunctionContext, RestResult } from '@ngfi/functions';

import { BotModule } from '@app/model/convs-mgr/bot-modules';
import { Story } from '@app/model/convs-mgr/stories/main';
import { Bot } from '@app/model/convs-mgr/bots';

/**
 * Handler to delete a module and its subsequent stories.
 */
export class DeleteModuleHandler extends FunctionHandler<{ moduleId: string, orgId: string; }, RestResult>
{

  public async execute(req: { moduleId: string, orgId: string; }, context: FunctionContext, tools: HandlerTools): Promise<RestResult>
  {
    try {
      // Delete modules
      const modulesRepo$ = tools.getRepository<BotModule>(`orgs/${req.orgId}/modules`);
      const storiesRepo$ = tools.getRepository<Story>(`orgs/${req.orgId}/stories`);

      const module = await modulesRepo$.getDocumentById(req.moduleId);

      const botsRepo$ = tools.getRepository<Bot>(`orgs/${req.orgId}/bots`);

      const bot = await botsRepo$.getDocumentById(module.parentBot);

      bot.modules = bot.modules.filter((modules)=> modules !== req.moduleId);

      const moduleStories = await storiesRepo$.getDocuments(new Query().where("parentModule", "==", module));

      for (const story of moduleStories) {
        const ref = admin.firestore().doc(`orgs/${req.orgId}/stories/${story.id}`);

        // Recursively delete the story and it's subcollections (blocks/connections)
        await admin.firestore().recursiveDelete(ref);
      }

      const deleteModule = await modulesRepo$.delete(module.id);

      await botsRepo$.update(bot);
      
      if (deleteModule) {
        tools.Logger.log(() => `[DeleteModuleHandler].execute - Module delete successful :: ${req.moduleId}`);

        return {
          status: 200,
          message: "Module delete successful",
        } as RestResult;
      } else {
        throw 'Failed to delete Module';
      }

    } catch (error) {
      tools.Logger.error(() => `[DeleteModuleHandler].execute - Error :: ${error}`);

      return {
        status: 500,
        message: "Failed to delete Module",
        data: error,
      } as RestResult;

    }

  }
}

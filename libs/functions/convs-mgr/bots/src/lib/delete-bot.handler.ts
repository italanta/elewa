import * as admin from 'firebase-admin';

import { HandlerTools } from '@iote/cqrs';
import { Query } from '@ngfi/firestore-qbuilder';
import { FunctionHandler, FunctionContext, RestResult } from '@ngfi/functions';

import { Bot } from '@app/model/convs-mgr/bots';
import { BotModule } from '@app/model/convs-mgr/bot-modules';
import { Story } from '@app/model/convs-mgr/stories/main';

/**
 * Handler to delete a bot and its subsequent modules and stories.
 */
export class DeleteBotHandler extends FunctionHandler<{ botId: string, orgId: string; }, RestResult>
{

  public async execute(req: { botId: string, orgId: string; }, context: FunctionContext, tools: HandlerTools): Promise<RestResult>
  {
    tools.Logger.log(() => `[DeleteBotHandler].execute - Received Payload :: ${JSON.stringify(req)}`);
    
    try {
      const modulesRepo$ = tools.getRepository<BotModule>(`orgs/${req.orgId}/modules`);
      const storiesRepo$ = tools.getRepository<Story>(`orgs/${req.orgId}/stories`);

      const botsRepo$ = tools.getRepository<Bot>(`orgs/${req.orgId}/bots`);

      const bot = await botsRepo$.getDocumentById(req.botId);
      for (const module of bot.modules) {

        const moduleStories = await storiesRepo$.getDocuments(new Query().where("parentModule", "==", module));

        for (const story of moduleStories) {
          const ref = admin.firestore().doc(`orgs/${req.orgId}/stories/${story.id}`);

          // Recursively delete the story and it's subcollections (blocks/connections)
          await admin.firestore().recursiveDelete(ref);
        }

        await modulesRepo$.delete(module);
      }

      const deleteBot = await botsRepo$.delete(bot.id);

      if (deleteBot) {
        tools.Logger.log(() => `[DeleteBotHandler].execute - Bot delete successful :: ${req.botId}`);
    
        return {
          status: 200,
          message: "Bot delete successful",
        } as RestResult;
      } else {
        throw 'Failed to delete bot';
      }

    } catch (error) {
      tools.Logger.error(() => `[DeleteBotHandler].execute - Error :: ${error}`);

      return {
        status: 500,
        message: "Failed to delete bot",
        data: error,
      } as RestResult;

    }

  }
}

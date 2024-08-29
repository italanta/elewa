import * as admin from 'firebase-admin';

import { HandlerTools } from '@iote/cqrs';
import { FunctionHandler, FunctionContext, RestResult } from '@ngfi/functions';

/**
 * Handler to delete a story and its subsequent blocks and connections.
 */
export class DeleteStoryHandler extends FunctionHandler<{ storyId: string, orgId: string; }, RestResult>
{

  public async execute(req: { storyId: string, orgId: string; }, context: FunctionContext, tools: HandlerTools): Promise<RestResult>
  {
    try {
      const ref = admin.firestore().doc(`orgs/${req.orgId}/stories/${req.storyId}`);

      // Recursively delete the story and it's subcollections (blocks/connections)
      await admin.firestore().recursiveDelete(ref);

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

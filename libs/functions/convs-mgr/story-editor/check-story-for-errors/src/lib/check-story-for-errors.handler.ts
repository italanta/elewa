import { HandlerTools } from '@iote/cqrs';

import { FunctionHandler, FunctionContext, RestResult } from '@ngfi/functions';
import { Query } from '@ngfi/firestore-qbuilder';

import { FlowError, FlowErrorType } from '@app/model/convs-mgr/stories/main';
import { StoryBlock } from '@app/model/convs-mgr/stories/blocks/main';
import { ListMessageBlock } from '@app/model/convs-mgr/stories/blocks/messaging';
import { Connection } from '@app/model/convs-mgr/conversations/chats';

/**
 * Handler to find flow errors in story connections and blocks.
 */
export class FindFlowErrorsHandler extends FunctionHandler<any, FlowError[]> {

  /**
   * Execute the function to find flow errors.
   * @param req - Request parameters including orgId and storyId.
   * @param context - FunctionContext containing information about the function execution.
   * @param tools - HandlerTools for logging and other utilities.
   * @returns Promise<FlowError[]> - Array of detected flow errors.
   */

  public async execute(req: { orgId: string, storyId: string }, context: FunctionContext, tools: HandlerTools): Promise<FlowError[]> {
    const errors: FlowError[] = [];
    const connectionIds = new Set();

    // Retrieve connections for the given orgId and storyId.
    const connectionRepo = tools.getRepository<Connection>(`orgs/${req.orgId}/stories/${req.storyId}/connections`);
    const connections = await connectionRepo.getDocuments(new Query());

    // Iterate through connections and collect their targetIds.
    connections.forEach((connection) => {
      connectionIds.add(connection.targetId);
    });

    // Retrieve blocks for the given orgId and storyId.
    const blocksRepo = tools.getRepository<StoryBlock>(`orgs/${req.orgId}/stories/${req.storyId}/blocks`);
    const blocks = await blocksRepo.getDocuments(new Query());

    // Iterate through blocks to find flow errors.
    blocks.forEach((block) => {
      // Errors are not applicable to the endblock
      if( block.id != 'story-end-anchor'){  
        if (!block.message || block.message.trim() == '') {
          errors.push({ type: FlowErrorType.EmptyTextField, blockId: block.id });
        }
        // Check if the blockIdToCheck is not in the targetIds array
        if (!connectionIds.has(block.id)) {
          errors.push({
            type: FlowErrorType.MissingConnection,
            blockId: block.id
          })
        }
        const listBlock = block as ListMessageBlock;

        if (listBlock?.options) {
          listBlock.options.forEach(button => {
            if (button.message || button.message.trim() == '') {
              errors.push({ type: FlowErrorType.EmptyTextField, blockId: listBlock.id })
            }
          })
        }
      }
    })

    // Return the array of detected flow errors.
    return errors;
  }
}

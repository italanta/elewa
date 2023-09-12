import { HandlerTools } from '@iote/cqrs';

import { FunctionHandler, FunctionContext, RestResult } from '@ngfi/functions';
import { Query } from '@ngfi/firestore-qbuilder';

import { StoryError, StoryErrorType } from '@app/model/convs-mgr/stories/main';
import { StoryBlock, isOptionBlock, isInputOptionBlock } from '@app/model/convs-mgr/stories/blocks/main';
import { KeywordMessageBlock, ListMessageBlock, QuestionMessageBlock } from '@app/model/convs-mgr/stories/blocks/messaging';
import { Connection } from '@app/model/convs-mgr/conversations/chats';

/**
 * Handler to find flow errors in story connections and blocks.
 */
export class FindStoryErrorHandler extends FunctionHandler<{orgId: string, storyId: string}, StoryError[]> {

  /**
   * Execute the function to find flow errors.
   * @param req - Request parameters including orgId and storyId.
   * @param context - FunctionContext containing information about the function execution.
   * @param tools - HandlerTools for logging and other utilities.
   * @returns Promise<StoryError[]> - Array of detected flow errors.
   */

  public async execute(req: { orgId: string, storyId: string }, context: FunctionContext, tools: HandlerTools): Promise<StoryError[]> {
    const errors: StoryError[] = [];
    const connectionIds = new Set();

    // Retrieve connections for the given orgId and storyId.
    // TODO: implement promise all to get both connections and blocks concurrently
    const connectionRepo = tools.getRepository<Connection>(`orgs/${req.orgId}/stories/${req.storyId}/connections`);
    const connections = await connectionRepo.getDocuments(new Query());

    // Iterate through connections and collect their sourceIds.
    connections.forEach((connection) => {
      connectionIds.add(connection.sourceId);
    });

    // Retrieve blocks for the given orgId and storyId.
    const blocksRepo = tools.getRepository<StoryBlock>(`orgs/${req.orgId}/stories/${req.storyId}/blocks`);
    const blocks = await blocksRepo.getDocuments(new Query());

    // The following checks if the start anchor is connected to anything
    if (!connectionIds.has(req.storyId)){
      errors.push({
        type: StoryErrorType.MissingConnection,
        blockId: req.storyId
      })
    }

    // Iterate through blocks to find flow errors.
    blocks.forEach((block) => {
      // Errors are not applicable to the endblock
      if ( block.id == 'story-end-anchor') return
      // If block is deleted don't check for errors
      if (block.deleted) return 
        // Check if message is empty for the block supplied
        if (this.isMessageEmpty(block.message)) {
          errors.push({ type: StoryErrorType.EmptyTextField, blockId: block.id });
        }
        // It's either a ListMessageBlock or a QuestionMessageBlock or Another block with opption
        if (isOptionBlock(block.type)) {
          const optionBlock = block as ListMessageBlock | QuestionMessageBlock | KeywordMessageBlock;
          optionBlock.options.forEach((option, index) => {
            if(this.isMessageEmpty(option.message)){
              errors.push({ type: StoryErrorType.EmptyTextField, blockId: block.id, optionsId: option.id })
            }
            if (!connectionIds.has(`i-${(index)}-${block.id}`)){
              errors.push({
                type: StoryErrorType.MissingConnection,
                blockId: block.id,
                optionsId: option.id
              })
            }
          });
        }
        // Check if the blockIdToCheck is not in the sourceIds array
        else {
          if (!connectionIds.has(`defo-${block.id}`)) {
          errors.push({
            type: StoryErrorType.MissingConnection,
            blockId: block.id
          })
        }}
    })
    return errors;
  }
  // Function to check if a block's message is empty
  private isMessageEmpty(message: string | undefined): boolean {
    return message?.trim() === '';
  }
}

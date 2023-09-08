import { HandlerTools } from '@iote/cqrs';

import { FunctionHandler, FunctionContext, RestResult } from '@ngfi/functions';
import { Query } from '@ngfi/firestore-qbuilder';

import { StoryError, StoryErrorType } from '@app/model/convs-mgr/stories/main';
import { StoryBlock } from '@app/model/convs-mgr/stories/blocks/main';
import { ListMessageBlock, QuestionMessageBlock } from '@app/model/convs-mgr/stories/blocks/messaging';
import { Connection } from '@app/model/convs-mgr/conversations/chats';

/**
 * Handler to find flow errors in story connections and blocks.
 */
export class FindStoryErrorHandler extends FunctionHandler<any, StoryError[]> {

  /**
   * Execute the function to find flow errors.
   * @param req - Request parameters including orgId and storyId.
   * @param context - FunctionContext containing information about the function execution.
   * @param tools - HandlerTools for logging and other utilities.
   * @returns Promise<FlowError[]> - Array of detected flow errors.
   */

  public async execute(req: { orgId: string, storyId: string }, context: FunctionContext, tools: HandlerTools): Promise<StoryError[]> {
    const errors: StoryError[] = [];
    const connectionIds = new Set();

    // // Extract block ids from the sourceId
    // function extractBlockId(sourceId: string) {
    //   const parts = sourceId.split("-");
    //   if (parts.length === 2) {
    //     const blockId = parts[1];
    //     return blockId;
    //   } else {
    //     return sourceId; 
    //   }
    // }

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

    // Iterate through blocks to find flow errors.
    blocks.forEach((block) => {
      // Errors are not applicable to the endblock
      if( block.id != 'story-end-anchor'){  
        // It's either a ListMessageBlock or a QuestionMessageBlock or Another block with opption
        if (this.blockHasOptions(block)) {
          const options = block.options;
          if (options) {
            // Check for empty message in block options
            options.forEach(option => {
              if (this.isMessageEmpty(option.message)) {
                errors.push({ type: StoryErrorType.EmptyTextField, blockId: block.id, optionsId: option.id })
              }
              if (!connectionIds.has(option.id)){
                errors.push({
                  type: StoryErrorType.MissingConnection,
                  blockId: block.id,
                  optionsId: option.id
                })
              }
            });
          }
        } 
        if (this.isMessageEmpty(block.message)) {
          errors.push({ type: StoryErrorType.EmptyTextField, blockId: block.id });
        }
        // Check if the blockIdToCheck is not in the sourceIds array
        if (!connectionIds.has(block.id) || !connectionIds.has(req.storyId)) {
          errors.push({
            type: StoryErrorType.MissingConnection,
            blockId: block.id
          })
        }

        
      }
    })

    // Return the array of detected flow errors.
    return errors;
  }

  // Type guard function to check if a block ha soptions (ListMessageBlock or QuestionMessageBlock)
  // TODO: Paul - Ask if there othe blocks with options 
  private blockHasOptions(block: StoryBlock): block is ListMessageBlock | QuestionMessageBlock {
    return 'options' in block;
  }

  // Function to check if a block's message is empty
  private isMessageEmpty(message: string | undefined): boolean {
    return !message || message.trim() === '';
  }
}

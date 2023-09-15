import { HandlerTools } from '@iote/cqrs';

import { FunctionHandler, FunctionContext, RestResult } from '@ngfi/functions';
import { Query } from '@ngfi/firestore-qbuilder';

import { StoryError, StoryErrorType } from '@app/model/convs-mgr/stories/main';
import { StoryBlock, isOptionBlock } from '@app/model/convs-mgr/stories/blocks/main';
import { KeywordMessageBlock, ListMessageBlock, QuestionMessageBlock } from '@app/model/convs-mgr/stories/blocks/messaging';
import { Connection } from '@app/model/convs-mgr/conversations/chats';

/**
 * Handler to find flow errors in story connections and blocks.
 */
export class FindStoryErrorHandler extends FunctionHandler<{blocks: StoryBlock[], connections: Connection[], storyId: string}, StoryError[]> {

  /**
   * Execute the function to find flow errors.
   * @param req - Request parameters including blocks and connections.
   * @param context - FunctionContext containing information about the function execution.
   * @returns Promise<StoryError[]> - Array of detected flow errors.
   */

  private errors: StoryError[];
  private connectionIds = new Set();

  public async execute(req: { blocks: StoryBlock[], connections: Connection[], storyId: string }): Promise<StoryError[]> {
    this.errors = [];

    // Retrieve connections and extract the source Ids.
    this.getConnectionSourceIds(req.connections);

    // Check if start anchor is connected to a block
    this.checkStartAnchorConnection(req.storyId);

    // Retrieve blocks for the given orgId and storyId and check for errors
    this.checkBlocksForErrors(req.blocks);

    return this.errors;
  }

  // Get connections and save sourceIds to the ConnectionIds array
  private getConnectionSourceIds(connections: Connection[]): void {
    connections.forEach((connection) => {
      this.connectionIds.add(connection.sourceId);
    });
  }

  // Check if start anchor is connected
  private checkStartAnchorConnection(storyId: string): void {
    this.checkMissingConnection(storyId, storyId);
  }

  // Check block for errors
  private checkBlocksForErrors(blocks: StoryBlock[]): void{
    blocks.forEach((block) => {
      if (block.id === 'story-end-anchor' || block.deleted) {
        return; // Skip checking for errors for end anchor and deleted blocks
      }
  
      this.checkEmptyTextField(block.message, block.id);
  
      if (isOptionBlock(block.type)) {
        const optionBlock = block as ListMessageBlock | QuestionMessageBlock | KeywordMessageBlock;
        optionBlock.options.forEach((option, index) => {
          this.checkEmptyTextField(option.message, block.id, option.id);
          this.checkMissingConnection(`i-${index}-${block.id}`, block.id, option.id);
        });
      } else {
        this.checkMissingConnection(`defo-${block.id}`, block.id);
      }
    });
  }

  // Reusable method for checking missing connections
  private checkMissingConnection(sourceId: string, blockId?: string, optionId?: string): void {
    if (!this.connectionIds.has(sourceId)) {
      this.errors.push({
        type: StoryErrorType.MissingConnection,
        blockId: blockId,
        optionsId: optionId,
      });
    }
  }

  // Reusable method for checking empty text fields
  private checkEmptyTextField(message: string | undefined, blockId: string, optionId?: string): void {
    if (message?.trim() === '') {
      this.errors.push({
        type: StoryErrorType.EmptyTextField,
        blockId: blockId,
        optionsId: optionId,
      });
    }
  }
}

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
export class FindStoryErrorHandler extends FunctionHandler<{orgId: string, storyId: string}, StoryError[]> {

  /**
   * Execute the function to find flow errors.
   * @param req - Request parameters including orgId and storyId.
   * @param context - FunctionContext containing information about the function execution.
   * @param tools - HandlerTools for logging and other utilities.
   * @returns Promise<StoryError[]> - Array of detected flow errors.
   */

  private errors: StoryError[];
  private connectionIds = new Set();

  public async execute(req: { orgId: string, storyId: string }, context: FunctionContext, tools: HandlerTools): Promise<StoryError[]> {
    this.errors = [];

    // Retrieve connections for the given orgId and storyId.
    await this.retrieveConnections(req.orgId, req.storyId, tools);

    // Check if start anchor is connected to a block
    this.checkStartAnchorConnection(req.storyId);

    // Retrieve blocks for the given orgId and storyId and check for errors
    await this.retrieveBlocks(req.orgId, req.storyId, tools);

    return this.errors;
  }

  // Get connections and save sourceIds to the ConnectionIds array
  private async retrieveConnections(orgId: string, storyId: string, tools: HandlerTools): Promise<void> {
    const connectionRepo = tools.getRepository<Connection>(`orgs/${orgId}/stories/${storyId}/connections`);
    const connections = await connectionRepo.getDocuments(new Query());
  
    connections.forEach((connection) => {
      this.connectionIds.add(connection.sourceId);
    });
  }

  private checkStartAnchorConnection(storyId: string): void {
    this.checkMissingConnection(storyId, storyId);
  }

  // Retriede blocks and  check for the errors
  private async retrieveBlocks(orgId: string, storyId: string, tools: HandlerTools): Promise<void> {
    const blocksRepo = tools.getRepository<StoryBlock>(`orgs/${orgId}/stories/${storyId}/blocks`);
    const blocks = await blocksRepo.getDocuments(new Query());
  
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

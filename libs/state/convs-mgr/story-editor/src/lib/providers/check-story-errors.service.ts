import { Injectable } from '@angular/core';

import { Connection } from '@app/model/convs-mgr/conversations/chats';
import { StoryBlock, isOptionBlock } from '@app/model/convs-mgr/stories/blocks/main';
import { KeywordMessageBlock, ListMessageBlock, QuestionMessageBlock } from '@app/model/convs-mgr/stories/blocks/messaging';
import { StoryError, StoryErrorType } from '@app/model/convs-mgr/stories/main';

@Injectable({
  providedIn: 'root'
})
export class CheckStoryErrorsService {
  private connectionIds = new Set();

  errors: StoryError[];

  constructor() {
    this.errors =[];
   }

  fetchFlowErrors(connections: Connection[], blocks: StoryBlock[], storyId: string) {
    this.errors =[];
    // Retrieve the connection Ids
    this.retrieveConnectionIds(connections);

    // Check if start anchor is connected
    this.checkStartAnchorConnection(storyId);
    
    // Check if the blocks have errors
    this.checkBlocksForErrors(blocks);
    return this.errors;
  }

  // Add connectionIds to the connection id set
  private retrieveConnectionIds(connections: Connection[]) {
    connections.forEach(connection => {
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
  
      this.checkEmptyTextField(block.message, block.id!);
  
      if (isOptionBlock(block.type)) {
        const optionBlock = block as ListMessageBlock | QuestionMessageBlock | KeywordMessageBlock;
        optionBlock.options!.forEach((option, index) => {
          this.checkEmptyTextField(option.message, block.id!, option.id);
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
        blockId: blockId!,
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

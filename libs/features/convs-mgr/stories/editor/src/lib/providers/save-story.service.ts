import { Injectable } from "@angular/core";

import { StoryError, StoryErrorType } from "@app/model/convs-mgr/stories/main";
import { StoryBlock, StoryBlockConnection, isMediaBlock, isOptionBlock } from "@app/model/convs-mgr/stories/blocks/main";

import { StoryEditorState, StoryEditorStateService } from "@app/state/convs-mgr/story-editor";

import { StoryEditorFrame } from "../model/story-editor-frame.model";
import { KeywordMessageBlock, ListMessageBlock, QuestionMessageBlock } from "@app/model/convs-mgr/stories/blocks/messaging";

@Injectable()
export class SaveStoryService 
{
  private validator: StoryError[];

  constructor(private _editorState$$: StoryEditorStateService) 
  { }

  saveStory(state: StoryEditorState, frame: StoryEditorFrame, doValidation = true )
  {
    this.validator = [];
    // STEP 1 - Prepare a validator. 
    //          The saving will be blocked unless the user explicitly approves to save invalid stories
    
    // STEP 2 - Validate and process connections from JsPlumb
    // Connecting happens within JsPlumb and outside of our state's control
    state.connections = this._getConnectionsFromFrame(state, frame);

    // STEP 3 - Validate and process blocks (side effect which updates validators)
    this._validateBlocks(state.connections, state.blocks, state.story.id!);

    // IF there are errors and it is the first run, block save and throw the errors.
    if(doValidation && this.validator.length > 0)
    {
      console.log(`Blocking save due to errors:`);
      console.log(this.validator);
      throw this.validator;
    }
    // IF validation passes, do the save

    return this._editorState$$.persist(state);
  }

  /**
   * Connections are drawn and managed inside of the jsPlumb instance.
   *  We therefore need to pull them out and process them carefully upon saving
   * 
   * The challenge is managing the target ID
   * 
   * @param state -  
   * @param frame -
   */
  private _getConnectionsFromFrame(state: StoryEditorState, frame: StoryEditorFrame)
  {
    const connsToProcess = [];
    const connsPlumb = frame.jsPlumbInstance.connections;

    for(const c of connsPlumb)
    {
      // Get target block from target ID or target.id param on the connection
      const target = state.blocks.find(b => b.id === c.target.id) ?? state.blocks.find(b => b.id === c.targetId);
      
      if(target)
        connsToProcess.push(({ id: c.id, sourceId: c.sourceId, targetId: target.id }) as StoryBlockConnection);
      else 
        this.validator.push({ 
          type: StoryErrorType.MissingConnection,
          blockId: c.sourceId,
          // message: `Connection ${c.id} is missing a valid target`
        });
    }

    return connsToProcess;
  }

  //
  // SECTION :: VALIDATE
  //

  /** 
   * Validator function for the flow
   */
  private _validateBlocks(connections: StoryBlockConnection[], blocks: StoryBlock[], storyId: string) 
  {
    // Check if start anchor is connected
    const startAnchorError = this._hasMissingConnection(connections, storyId, storyId);
    if(startAnchorError)
      this.validator.push(startAnchorError);

    // Check if the blocks have errors
    for(const block of blocks)
    {
      if (block.id === 'story-end-anchor' || block.deleted) {
        continue; // Skip checking for errors for end anchor and deleted blocks
      }
  
      // Check for empty text body
      const hasEmptyTextFields = !isMediaBlock(block.type) 
                                    ? this.checkEmptyTextField(block.message, block.id as string) 
                                        : false;

      if(hasEmptyTextFields)
        this.validator.push(hasEmptyTextFields);

      // Check for empty text options
      if (isOptionBlock(block.type) && (block as QuestionMessageBlock).options) 
      {
        const optionBlock = block as ListMessageBlock | QuestionMessageBlock | KeywordMessageBlock;
        
        let i = 0;

        for(const option of optionBlock.options!)
        {
          const hasEmptyOption = this.checkEmptyTextField(option.message, block.id as string, option.id);
          const hasEmptyConnectionOnOption = this._hasMissingConnection(connections, `i-${i}-${block.id}`, block.id, option.id);

          if(hasEmptyOption) this.validator.push(hasEmptyOption);
          if(hasEmptyConnectionOnOption) this.validator.push(hasEmptyConnectionOnOption);
          i++;
        }
      }
      else {
        const hasEmptyConnectionOnOption = this._hasMissingConnection(connections, `defo-${block.id}`, block.id);
        if(hasEmptyConnectionOnOption) this.validator.push(hasEmptyConnectionOnOption);
      }
    }
    return this.validator;
  }


  // Reusable method for checking missing connections
  private _hasMissingConnection(connections: StoryBlockConnection[], sourceId: string, blockId?: string, optionId?: string): StoryError | false 
  {
    if (!connections.find(c => c.sourceId === sourceId)) 
      return ({
        type: StoryErrorType.MissingConnection,
        blockId: blockId as string,
        optionsId: optionId,
      });

    return false;
  }

  // Reusable method for checking empty text fields
  private checkEmptyTextField(message: string | undefined, blockId: string, optionId?: string): StoryError | false  
  {
    if (message?.trim() === '')
    {
      return {
        type: StoryErrorType.EmptyTextField,
        blockId: blockId,
        optionsId: optionId,
      };
    }
    return false;
  }
}
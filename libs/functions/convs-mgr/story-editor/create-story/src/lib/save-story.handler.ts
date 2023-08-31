import { FunctionContext, FunctionHandler } from '@ngfi/functions'; // Import the necessary modules here
import { HandlerTools } from '@iote/cqrs';

import { StoryEditorState } from '@app/state/convs-mgr/story-editor';


import * as functions from 'firebase-functions';


import { BlockDataService } from './services/block.service';


/**
 * This handler is responsible for saving conncetions and blocks to firestore database 
 */

export class SaveStoryHandler extends FunctionHandler<any, { success: boolean }> {
  private _tools: HandlerTools;
  
  /**
   * Execute the function
   * @param data - StoryEditorState containing data for the story
   * @param context - FunctionContext containing information about the function execution
   * @param tools - HandlerTools for logging and other utilities
   * @returns Promise<{ success: boolean }>
   */

  public execute(data: StoryEditorState, context: FunctionContext, tools: HandlerTools): Promise<{ success: boolean }> {
      this._tools = tools;
      this._tools.Logger.debug(() => `Beginning Execution, Creating a new Story`)
      
      return this.saveStory(data);
  }
  /**
   * save story's blocks and connections to fireStore
   * @param data  is obtained from story-editor.page.ts as the state passed to the cloud function
   * @returns promise<{ success : boolean }>
   */
  private async saveStory(data: StoryEditorState): Promise<{ success: boolean }> {
       try {

      const { blocks,story } = data;
        
        // Create an instance of BlockDataService
      const blockDataService = new BlockDataService();

      // Call the method on the instance
      await blockDataService.saveBlocks(story.orgId, story.id, blocks);


      return { success: true }; // Return success here
    } catch (error) {
      console.error('Error creating story end block:', error);
      throw new functions.https.HttpsError(
        'internal',
        'Error creating story end block',
        error
      );
    }
  }
}

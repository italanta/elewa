import { FunctionContext, FunctionHandler } from '@ngfi/functions'; // Import the necessary modules here
import { HandlerTools } from '@iote/cqrs';

import { StoryEditorState, StoryEditorStateService } from '@app/state/convs-mgr/story-editor';
import { BlockDataService, ConnectionsDataService } from '@app/functions/bot-engine';

import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';





// Create a class for the CreateNewStoryHandler
export class SaveStoryHandler extends FunctionHandler<any, { success: boolean }> {

  private _tools: HandlerTools;
    private _blocksDataService: BlockDataService;
    private _connDataService : ConnectionsDataService
    private _storyEditorStateService : StoryEditorStateService

  public execute(data: StoryEditorState, context: FunctionContext, tools: HandlerTools): Promise<{ success: boolean }> {
      this._tools = tools;
      this._tools.Logger.debug(() => `Beginning Execution, Creating a new Story`)

      return this.storySaved(data);
  }
  
  private async storySaved(data: StoryEditorState): Promise<{ success: boolean }> {
       try {

      const { blocks,story } = data;
        
      const blocksRef = admin
    .firestore()
    .collection(`orgs/${story.orgId}/stories/${story.id}/blocks`);

    for (const block of blocks) {
      await blocksRef.doc(block.id).set(block);
    }

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

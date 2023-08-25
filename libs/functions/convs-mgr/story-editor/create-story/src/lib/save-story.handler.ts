import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { FunctionContext, FunctionHandler } from '@ngfi/functions'; // Import the necessary modules here
import { HandlerTools } from '@iote/cqrs';

// Initialize the Firebase SDK
admin.initializeApp();

// Create a class for the CreateNewStoryHandler
export class SaveStoryHandler extends FunctionHandler<any, { success: boolean }> {

  private _tools: HandlerTools;

  public execute(data: any, context: FunctionContext, tools: HandlerTools): Promise<{ success: boolean }> {
      this._tools = tools;
      this._tools.Logger.debug(() => `Beginning Execution, Creating a new Story`)

      return this.storySaved(data);
  }
  
  private async storySaved(data: { orgId: any; storyId: any; }): Promise<{ success: boolean }> {
       try {
      const { orgId, storyId } = data;

      const fakeOffsetX = 20000 / 2 + 800;
      const fakeOffsetY = 20000 / 2;

      const endBlock = {
        id: 'story-end-anchor',
        type: 'EndStoryAnchorBlock',
        position: { x: fakeOffsetX, y: fakeOffsetY },
        deleted: false,
        blockTitle: 'End here',
        blockIcon: '',
        blockCategory: '',
      };

      const blocksRef = admin.firestore().collection(`orgs/${orgId}/stories/${storyId}/blocks`);
      await blocksRef.doc(endBlock.id).set(endBlock);

      return { success: true }; // Return success here
    } catch (error) {
      console.error('Error creating story end block:', error);
      throw new functions.https.HttpsError('internal', 'Error creating story end block', error);
    }
  }
}

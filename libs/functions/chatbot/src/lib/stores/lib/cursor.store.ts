import { Query } from '@ngfi/firestore-qbuilder';
import { HandlerTools } from '@iote/cqrs';

import { Activity, Platforms } from '@app/model/convs-mgr/conversations/admin/system';
import { Block, ChatInfo } from '@app/model/convs-mgr/conversations/chats';

/**
 * Contains all the required database flow methods for the cursor collection
 */
export class CursorStore {
  tools: HandlerTools;

  constructor(tools: HandlerTools) 
  {
    this.tools = tools;
  }
  
  /** Returns the latest activity / latest position of the cursor */
  async getLatestActivity(chatInfo: ChatInfo, platform: Platforms): Promise<Activity>{
    const cursorRepo$ = this.tools.getRepository<Activity>(
      `user-activity/${chatInfo.phoneNumber}/stories/${chatInfo.storyId}/platforms/${platform}/cursor`
    );

    const latestBlock = await cursorRepo$.getDocuments(new Query().orderBy('createdOn', 'desc').limit(1));

    return latestBlock[0];
  }

  /** Updates the cursor with the block */
  async moveCursor(chatInfo: ChatInfo, newBlock: Block, platform: Platforms): Promise<Activity> {
    const cursorRepo$ = this.tools.getRepository<Activity>(
      `user-activity/${chatInfo.phoneNumber}/stories/${chatInfo.storyId}/platforms/${platform}/cursor`
    );

    const timeStamp = Date.now();
    const newActivity: Activity = {
      chatId: timeStamp.toString(),
      block: newBlock,
    };
    //Update milestone
    const block = await cursorRepo$.create(newActivity, newActivity.chatId);

    // Return next block
    return block;
  }

  async getActivity(chatInfo: ChatInfo, platform: Platforms) {
    // Get subject
    // TODO: Create a type for user-activity
    const activityRepo$ = this.tools.getRepository<Activity>(
      `user-activity/${chatInfo.phoneNumber}/stories/${chatInfo.storyId}/platforms/${platform}/cursor`
    );
    const activity = await activityRepo$.getDocuments(new Query());

    return activity;
  }
}

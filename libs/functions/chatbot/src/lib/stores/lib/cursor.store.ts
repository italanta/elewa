import { Query } from '@ngfi/firestore-qbuilder';
import { HandlerTools } from '@iote/cqrs';

import { Cursor, Platforms } from '@app/model/convs-mgr/conversations/admin/system';
import { Block, ChatInfo } from '@app/model/convs-mgr/conversations/chats';
import { BaseMessage } from '@app/model/convs-mgr/conversations/messages';

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
  async getLatestCursor(msg: BaseMessage): Promise<Cursor | boolean>{
    const cursorRepo$ = this.tools.getRepository<Cursor>(
      `end-users/${msg.phoneNumber}/activity/${msg.storyId}/platforms/${msg.platform}/cursor`
    );

    const latestBlock = await cursorRepo$.getDocuments(new Query().orderBy('createdOn', 'desc').limit(1));
    
    if (latestBlock){
      return latestBlock[0]
    } else {
      return false;
    }

  }

  /** Updates the cursor with the block */
  async updateCursor(msg: BaseMessage, newBlock: Block): Promise<Cursor> {
    const cursorRepo$ = this.tools.getRepository<Cursor>(
      `end-users/${msg.phoneNumber}/activity/${msg.storyId}/platforms/${msg.platform}/cursor`
    );

    const timeStamp = Date.now();
    const newActivity: Cursor = {
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
    const activityRepo$ = this.tools.getRepository<Cursor>(
      `end-users/${chatInfo.phoneNumber}/stories/${chatInfo.storyId}/platforms/${platform}/cursor`
    );
    const activity = await activityRepo$.getDocuments(new Query());

    return activity;
  }
}

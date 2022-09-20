import { Query } from '@ngfi/firestore-qbuilder';
import { HandlerTools } from "@iote/cqrs";

import { Activity, Platforms } from "@app/model/convs-mgr/conversations/admin/system";
import { Chat, ChatStatus } from "@app/model/convs-mgr/conversations/messages";
import { Block, ChatInfo, Connection, DefaultBlock } from "@app/model/convs-mgr/conversations/chats";
import { StoryBlock } from "@app/model/convs-mgr/stories/blocks/main";

/**
 * Contains all the required database flow methods for the chatbot
 */
export class ChatBotStore {
    tools: HandlerTools;
    constructor(tools: HandlerTools){
    this.tools = tools
    }

    /** Cursor */

    async getLatestActivity(chatInfo: ChatInfo): Promise<Block> {
        const cursorRepo$ = this.tools.getRepository<Block>(`user-activity/${chatInfo.id}/stories/${chatInfo.storyId}/cursor`);
    
        const latestBlock = await cursorRepo$.getDocuments(new Query().orderBy('createdOn', 'desc').limit(1));
    
        return latestBlock[0];
      }
    
      async updateCursor(chatInfo: ChatInfo, newBlock: Block, platform: Platforms): Promise<Activity> {
        const cursorRepo$ = this.tools.getRepository<Activity>(`user-activity/${chatInfo.id}/stories/${chatInfo.storyId}/cursor`);
    
        const newActivity: Activity = {
          chatId: platform + '_' + chatInfo.storyId,
          block: newBlock
        }
        //Update milestone
        const block = await cursorRepo$.update(newActivity);
    
        // Return next block
        return block;
      }
    
      async getActivity(chatInfo: ChatInfo) {
        // Get subject
        // TODO: Create a type for user-activity
        const activityRepo$ = this.tools.getRepository<Activity>(`user-activity/${chatInfo.id}/stories/${chatInfo.storyId}/cursor`);
        const activity = await activityRepo$.getDocumentById(chatInfo.id);
    
        return activity;
      }
    

      /** Chat Info */

      async getChatInfo(phoneNumber: string, platform: Platforms): Promise<ChatInfo> {
        // Get users
        const userRepo$ = this.tools.getRepository<ChatInfo>(`end-users/${phoneNumber}/platforms`);
        const chatInfo = await userRepo$.getDocumentById(platform);
        if (!chatInfo) {
          throw new Error('User does not exist!');
        }
        return chatInfo;
      }

      async registerChatInfo(info: ChatInfo, platform: Platforms): Promise<ChatInfo> {
        // Get users
        const userRepo$ = this.tools.getRepository<ChatInfo>(`end-users/${info.id}/platforms`);

        const chatInfo: ChatInfo = {
          id: info.id,
          orgId: info.orgId,
          storyId: info.storyId,
        }
        if (!chatInfo) {
          throw new Error('User does not exist!');
        }

        await userRepo$.write(chatInfo, platform)
        return chatInfo;
      }

      /** Blocks and Connections */
    
      async getNextBlockFromDefault(chatInfo: ChatInfo, defaultBlock: DefaultBlock): Promise<Block> {
        const nextBlock: Block = await this.getBlockById(defaultBlock.nextBlock, chatInfo);
    
        const BlockRepo$ = this.tools.getRepository<Block>(`user-activity/${chatInfo.id}/stories/${chatInfo.storyId}/cursor`);
    
        await BlockRepo$.write(nextBlock, nextBlock.id);
    
        return nextBlock;
      }
    
      async getDefaultBlock(chatInfo: ChatInfo): Promise<DefaultBlock> {
        const orgRepo$ = this.tools.getRepository<DefaultBlock>(`orgs/${chatInfo.orgId}/stories/${chatInfo.storyId}/blocks`);
        const id = 'default';
    
        const defaultBlock = await orgRepo$.getDocumentById(id);
    
        if (!defaultBlock) {
          throw new Error('No default block set');
        }
        return defaultBlock;
      }
    
      async getConnByOption(id: string, chatInfo: ChatInfo): Promise<Connection>{
        const orgRepo$ = this.tools.getRepository<Connection>(`orgs/${chatInfo.orgId}/stories/${chatInfo.storyId}/connections`);
    
        const conn = await orgRepo$.getDocuments(new Query().where('sourceId', '==', id))[0]
    
        if(!conn[0]){
          throw new Error('Connection does not exist')
        }
    
        return conn[0]
      }
    
      async getConnBySourceId(blockId: string, chatInfo: ChatInfo): Promise<Connection>{
        const orgRepo$ = this.tools.getRepository<Connection>(`orgs/${chatInfo.orgId}/stories/${chatInfo.storyId}/connections`);
    
        const conn = await orgRepo$.getDocuments(new Query().where('sourceId', '==', `defo-${blockId}`))[0]
    
        if(!conn[0]){
          throw new Error('Connection does not exist')
        }
    
        return conn[0]
      }
    
      async getBlockById(id: string, chatInfo: ChatInfo): Promise<Block>{
        const orgRepo$ = this.tools.getRepository<StoryBlock>(`orgs/${chatInfo.orgId}/stories/${chatInfo.storyId}/blocks`);
    
        const block: Block = await orgRepo$.getDocumentById(id)
    
        if(!block){
          throw new Error('Block does not exist')
        }
    
        return block
      }

      /** Chat */

      async initChatStatus(chatInfo: ChatInfo, platform: Platforms){
        const chatId = platform + '_' + chatInfo.storyId
        const chatRepo$ = this.tools.getRepository<Chat>(`chat-status/${chatInfo.id}/chats/${chatId}`);

        const newStatus: Chat = {
          chatId,
          status: ChatStatus.Running,
          platform: platform
        }
        const newChat = await chatRepo$.write(newStatus, chatId)

        return newChat
      }

      async getChatStatus(chatInfo: ChatInfo, platform: Platforms){
        const chatId = platform + '_' + chatInfo.storyId
        const chatRepo$ = this.tools.getRepository<Chat>(`chat-status/${chatInfo.id}/chats`);

        const chatStatus = await chatRepo$.getDocumentById(chatId)

        return chatStatus
      }

      async updateChatStatus(chatInfo: ChatInfo, status: ChatStatus, platform: Platforms){
        const chatId = platform + '_' + chatInfo.storyId

        const chatRepo$ = this.tools.getRepository<Chat>(`chat-status/${chatInfo.id}/chats/${chatId}`);

        const newStatus: Chat = {
          chatId,
          status,
          platform
        }
        chatRepo$.write(newStatus, chatId)
      }
}

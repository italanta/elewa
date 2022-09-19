import { StoryBlock } from "@app/model/convs-mgr/stories/blocks/main";
import { Query } from '@ngfi/firestore-qbuilder';
import { IObject } from '@iote/bricks';
import { HandlerTools } from "@iote/cqrs";
import { TextMessageBlock, QuestionMessageBlock } from "@app/model/convs-mgr/stories/blocks/messaging";
import { Platforms } from "@app/model/convs-mgr/conversations/admin/system";

/**
 * Contains all the required database flow methods for the chatbot
 */
export class ChatBotStore {
    tools: HandlerTools;
    constructor(tools: HandlerTools){
    this.tools = tools
    }

    /** Cursor */

    async getLatestActivity(user: EndUser): Promise<Block> {
        const cursorRepo$ = this.tools.getRepository<Block>(`user-activity/${user.id}/stories/${user.storyId}/cursor`);
    
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
    
      async getActivity(user: EndUser) {
        // Get subject
        // TODO: Create a type for user-activity
        const activityRepo$ = this.tools.getRepository<Activity>(`user-activity/${user.id}/stories/${user.storyId}/cursor`);
        const activity = await activityRepo$.getDocumentById(user.id);
    
        return activity;
      }
    

      /*Users */

      async getEndUser(phoneNumber: string): Promise<EndUser> {
        // Get users
        const userRepo$ = this.tools.getRepository<EndUser>('end-users');
        const user = await userRepo$.getDocumentById(phoneNumber);
        if (!user) {
          throw new Error('User does not exist!');
        }
        return user;
      }

      async getChatInfo(phoneNumber: string, platform: Platforms): Promise<ChatInfo> {
        // Get users
        const userRepo$ = this.tools.getRepository<ChatInfo>(`end-users/${phoneNumber}/platforms`);
        const chatInfo = await userRepo$.getDocumentById(platform);
        if (!chatInfo) {
          throw new Error('User does not exist!');
        }
        return chatInfo;
      }

      async registerChatInfo(info: {phoneNumber: string, orgId: string, storyId: string}, platform: Platforms): Promise<ChatInfo> {
        // Get users
        const userRepo$ = this.tools.getRepository<ChatInfo>(`end-users/${info.phoneNumber}/platforms`);

        const chatInfo: ChatInfo = {
          id: info.phoneNumber,
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
    
      async getDefaultBlock(user: ChatInfo): Promise<DefaultBlock> {
        const orgRepo$ = this.tools.getRepository<DefaultBlock>(`orgs/${user.orgId}/stories/${user.storyId}/blocks`);
        const id = 'default';
    
        const defaultBlock = await orgRepo$.getDocumentById(id);
    
        if (!defaultBlock) {
          throw new Error('No default block set');
        }
        return defaultBlock;
      }
    
      async getConnByOption(id: string, user: EndUser): Promise<Connection>{
        const orgRepo$ = this.tools.getRepository<Connection>(`orgs/${user.orgId}/stories/${user.storyId}/connections`);
    
        const conn = await orgRepo$.getDocuments(new Query().where('sourceId', '==', id))[0]
    
        if(!conn[0]){
          throw new Error('Connection does not exist')
        }
    
        return conn[0]
      }
    
      async getConnBySourceId(blockId: string, user: EndUser): Promise<Connection>{
        const orgRepo$ = this.tools.getRepository<Connection>(`orgs/${user.orgId}/stories/${user.storyId}/connections`);
    
        const conn = await orgRepo$.getDocuments(new Query().where('sourceId', '==', `defo-${blockId}`))[0]
    
        if(!conn[0]){
          throw new Error('Connection does not exist')
        }
    
        return conn[0]
      }
    
      async getBlockById(id: string, user: ChatInfo): Promise<Block>{
        const orgRepo$ = this.tools.getRepository<StoryBlock>(`orgs/${user.orgId}/stories/${user.storyId}/blocks`);
    
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

      async getChatStatus(user: ChatInfo, platform: Platforms){
        const chatId = platform + '_' + user.storyId
        const chatRepo$ = this.tools.getRepository<Chat>(`chat-status/${user.id}/chats`);

        const chatStatus = await chatRepo$.getDocumentById(chatId)

        return chatStatus
      }

      async updateChatStatus(user: EndUser, status: ChatStatus){
        const chatId = user.platform + '_' + user.storyId

        const chatRepo$ = this.tools.getRepository<Chat>(`chat-status/${user.id}/chats/${chatId}`);

        const newStatus: Chat = {
          chatId,
          status,
          platform: user.platform
        }
        chatRepo$.write(newStatus, chatId)
      }
}


export interface Chat extends IObject{
  chatId: string;
  status: ChatStatus;
  platform: Platforms;

}

export enum ChatStatus {
  Running           = 0,
  Paused            = 5,
  ChatWithOperator  = 10,
  Ended             = 15
}
export interface Connection extends IObject {
    slot: number;
    sourceId: string;
    targetId: string;
  }
  
  export interface EndUser {
    id: string;
    orgId: string;
    storyId: string;
    platform: Platforms;
  }

  export interface ChatInfo {
    id: string;
    orgId: string;
    storyId: string;
  }
  
  export interface DefaultBlock extends StoryBlock {
    nextBlock: string;
  }

  export interface Activity extends IObject{
    chatId: string;
    block: Block;
  }
  
  export type Block = TextMessageBlock | QuestionMessageBlock;
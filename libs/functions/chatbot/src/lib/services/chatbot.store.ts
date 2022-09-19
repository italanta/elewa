import { StoryBlock } from "@app/model/convs-mgr/stories/blocks/main";
import { Query } from '@ngfi/firestore-qbuilder';
import { IObject } from '@iote/bricks';
import { HandlerTools } from "@iote/cqrs";
import { TextMessageBlock, QuestionMessageBlock } from "@app/model/convs-mgr/stories/blocks/messaging";

/**
 * Contains all the required database flow methods for the chatbot
 */
export class ChatBotStore {
    tools: HandlerTools;
    constructor(tools: HandlerTools){
    this.tools = tools
    }

    async getLatestActivity(user: EndUser): Promise<Block> {
        const cursorRepo$ = this.tools.getRepository<Block>(`user-activity/${user.id}/stories/${user.storyId}/cursor`);
    
        const latestBlock = await cursorRepo$.getDocuments(new Query().orderBy('createdOn', 'desc').limit(1));
    
        return latestBlock[0];
      }
    
      async updateActivity(user: EndUser, newBlock: Block): Promise<Block> {
        const cursorRepo$ = this.tools.getRepository<Block>(`user-activity/${user.id}/stories/${user.storyId}/cursor`);
    
        //Update milestone
        const block = await cursorRepo$.update(newBlock);
    
        // Return next block
        return block;
      }
    
      async getActivity(user: EndUser) {
        // Get subject
        // TODO: Create a type for user-activity
        const activityRepo$ = this.tools.getRepository<Block>(`user-activity/${user.id}/stories/${user.storyId}/cursor`);
        const activity = await activityRepo$.getDocumentById(user.id);
    
        return activity;
      }
    
      async getEndUser(phoneNumber: string): Promise<EndUser> {
        // Get users
        const userRepo$ = this.tools.getRepository<EndUser>('end-users');
        const user = await userRepo$.getDocumentById(phoneNumber);
        if (!user) {
          throw new Error('User does not exist!');
        }
        return user;
      }
    
      async getNextBlockFromDefault(user: EndUser, defaultBlock: DefaultBlock): Promise<Block> {
        const nextBlock: Block = await this.getBlockById(defaultBlock.nextBlock, user);
    
        const BlockRepo$ = this.tools.getRepository<Block>(`user-activity/${user.id}/stories/${user.storyId}/cursor`);
    
        await BlockRepo$.write(nextBlock, nextBlock.id);
    
        return nextBlock;
      }
    
      async getDefaultBlock(user: EndUser): Promise<DefaultBlock> {
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
    
      async getBlockById(id: string, provider: any): Promise<Block>{
        const orgRepo$ = this.tools.getRepository<StoryBlock>(`orgs/${provider.orgId}/stories/${provider.storyId}/blocks`);
    
        const block: Block = await orgRepo$.getDocumentById(id)
    
        if(!block){
          throw new Error('Block does not exist')
        }
    
        return block
      }
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
  
  export enum Platforms {
    WhatsApp = 'whatsapp',
    Telegram = 'telegram',
  }
  
  export interface DefaultBlock extends StoryBlock {
    nextBlock: string;
  }
  
  export type Block = TextMessageBlock | QuestionMessageBlock;
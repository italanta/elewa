import { Query } from '@ngfi/firestore-qbuilder';
import { HandlerTools } from '@iote/cqrs';
import { Logger } from '@iote/cqrs';
import { IObject } from '@iote/bricks';

import { StoryBlock } from '@app/model/convs-mgr/stories/blocks/main';
import { TextMessageBlock, QuestionMessageBlock } from '@app/model/convs-mgr/stories/blocks/messaging';


/**
 * Handles the main processes of the ChatBot
 */
export class ChatBotService {
  constructor(private _logger: Logger) {}

  async init(user: EndUser, tools: HandlerTools): Promise<Block> {
    // Get the default block
    const defaultBlock: DefaultBlock = await this._getDefaultBlock(user, tools);

    const activityRepo$ = tools.getRepository<DefaultBlock>(`user-activity/${user.id}/stories/${user.storyId}/cursor`);

    // Create subject
    await activityRepo$.write(defaultBlock, defaultBlock.id);

    // Get the next block using the default block
    const nextBlock: Block = await this._getNextBlockFromDefault(user, defaultBlock, tools);

    return nextBlock;
  }

  async getLatestActivity(user: EndUser, tools: HandlerTools): Promise<Block> {
    const cursorRepo$ = tools.getRepository<Block>(`user-activity/${user.id}/stories/${user.storyId}/cursor`);

    const latestBlock = await cursorRepo$.getDocuments(new Query().orderBy('createdOn', 'desc').limit(1));

    return latestBlock[0];
  }

  async updateActivity(user: EndUser, newBlock: Block, tools: HandlerTools): Promise<Block> {
    const cursorRepo$ = tools.getRepository<Block>(`user-activity/${user.id}/stories/${user.storyId}/cursor`);

    //Update milestone
    const block = await cursorRepo$.update(newBlock);

    // Return next block
    return block;
  }

  async getActivity(user: EndUser, tools: HandlerTools) {
    // Get subject
    // TODO: Create a type for user-activity
    const activityRepo$ = tools.getRepository<Block>(`user-activity/${user.id}/stories/${user.storyId}/cursor`);
    const activity = await activityRepo$.getDocumentById(user.id);

    return activity;
  }

  async getEndUser(phoneNumber: string, tools: HandlerTools): Promise<EndUser> {
    // Get users
    const userRepo$ = tools.getRepository<EndUser>('end-users');
    const user = await userRepo$.getDocumentById(phoneNumber);
    if (!user) {
      throw new Error('User does not exist!');
    }
    return user;
  }

  private async _getNextBlockFromDefault(user: EndUser, defaultBlock: DefaultBlock, tools: HandlerTools): Promise<Block> {
    const nextBlock: Block = await this._getBlockById(defaultBlock.nextBlock, user, tools);

    const BlockRepo$ = tools.getRepository<Block>(`user-activity/${user.id}/stories/${user.storyId}/cursor`);

    await BlockRepo$.write(nextBlock, nextBlock.id);

    return nextBlock;
  }

  private async _getDefaultBlock(user: EndUser, tools: HandlerTools): Promise<DefaultBlock> {
    const orgRepo$ = tools.getRepository<DefaultBlock>(`orgs/${user.orgId}/stories/${user.storyId}/blocks`);
    const id = 'default';

    const defaultBlock = await orgRepo$.getDocumentById(id);

    if (!defaultBlock) {
      throw new Error('No default block set');
    }
    return defaultBlock;
  }

  private async _getBlockById(id: string, user: any, tools: HandlerTools): Promise<Block> {
    const orgRepo$ = tools.getRepository<Block>(`orgs/${user.orgId}/stories/${user.storyId}/blocks`);

    const block: Block = await orgRepo$.getDocumentById(id);

    if (!block) {
      throw new Error('Block does not exist');
    }

    return block;
  }

  async getConnByOption(id: string, user: EndUser, tools: HandlerTools): Promise<Connection>{
    const orgRepo$ = tools.getRepository<Connection>(`orgs/${user.orgId}/stories/${user.storyId}/connections`);

    const conn = await orgRepo$.getDocuments(new Query().where('sourceId', '==', id))[0]

    if(!conn[0]){
      throw new Error('Connection does not exist')
    }

    return conn[0]
  }

  async getConnBySourceId(blockId: string, user: EndUser, tools: HandlerTools): Promise<Connection>{
    const orgRepo$ = tools.getRepository<Connection>(`orgs/${user.orgId}/stories/${user.storyId}/connections`);

    const conn = await orgRepo$.getDocuments(new Query().where('sourceId', '==', `defo-${blockId}`))[0]

    if(!conn[0]){
      throw new Error('Connection does not exist')
    }

    return conn[0]
  }

  async getBlockById(id: string, provider: any, tools: HandlerTools): Promise<Block>{
    const orgRepo$ = tools.getRepository<StoryBlock>(`orgs/${provider.orgId}/stories/${provider.storyId}/blocks`);

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

import { Query } from '@ngfi/firestore-qbuilder';
import { HandlerTools } from '@iote/cqrs';

import { Block, ChatInfo, Connection, DefaultBlock } from '@app/model/convs-mgr/conversations/chats';
import { StoryBlock } from '@app/model/convs-mgr/stories/blocks/main';

/**
 * Contains all the required database flow methods for writing and reading blocks information
 */
export class BlockConnectionsStore {
  tools: HandlerTools;

  constructor(tools: HandlerTools) 
  {
    this.tools = tools;
  }

  async getBlockById(id: string, chatInfo: ChatInfo): Promise<Block> {
    const orgRepo$ = this.tools.getRepository<StoryBlock>(`orgs/${chatInfo.orgId}/stories/${chatInfo.storyId}/blocks`);

    const block: Block = await orgRepo$.getDocumentById(id);

    if (!block) {
      throw new Error('Block does not exist');
    }

    return block;
  }

  async getDefaultBlock(chatInfo: ChatInfo): Promise<DefaultBlock> {
    const orgRepo$ = this.tools.getRepository<DefaultBlock>(`orgs/${chatInfo.orgId}/stories/${chatInfo.storyId}/blocks`);
    const id = chatInfo.storyId;

    const defaultBlock = await orgRepo$.getDocumentById(id);

    if (!defaultBlock) {
      throw new Error('No default block set');
    }
    return defaultBlock;
  }

  async getConnByOption(id: string, chatInfo: ChatInfo): Promise<Connection> {
    const orgRepo$ = this.tools.getRepository<Connection>(`orgs/${chatInfo.orgId}/stories/${chatInfo.storyId}/connections`);

    const conn = await orgRepo$.getDocuments(new Query().where('sourceId', '==', id));

    if (!conn[0]) {
      throw new Error('Connection does not exist');
    }

    return conn[0];
  }

  async getConnBySourceId(blockId: string, chatInfo: ChatInfo): Promise<Connection> {
    const orgRepo$ = this.tools.getRepository<Connection>(`orgs/${chatInfo.orgId}/stories/${chatInfo.storyId}/connections`);

    const conn = await orgRepo$.getDocuments(new Query().where('sourceId', '==', `defo-${blockId}`));

    if (!conn[0]) {
      throw new Error('Connection does not exist');
    }

    return conn[0];
  }

  async getFirstConn(storyId: string, chatInfo: ChatInfo): Promise<Connection> {
    const orgRepo$ = this.tools.getRepository<Connection>(`orgs/${chatInfo.orgId}/stories/${chatInfo.storyId}/connections`);

    const conn = await orgRepo$.getDocuments(new Query().where('sourceId', '==', `${storyId}`));

    if (!conn[0]) {
      throw new Error('First Connection does not exist');
    }

    return conn[0];
  }
}

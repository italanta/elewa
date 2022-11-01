import { Query } from '@ngfi/firestore-qbuilder';
import { HandlerTools } from '@iote/cqrs';

import { Block } from '@app/model/convs-mgr/conversations/chats';
import { StoryBlock } from '@app/model/convs-mgr/stories/blocks/main';
import { Message } from '@app/model/convs-mgr/conversations/messages';
import { BotDataService } from './data-service-abstract.class';
import { ConnectionsDataService } from './connections.service';
import { CommunicationChannel } from '@app/model/convs-mgr/conversations/admin/system';

/**
 * Contains all the required database flow methods for writing and reading blocks information
 */
export class BlockDataService extends BotDataService<StoryBlock> {
  private _docPath: string;
  private _channel: CommunicationChannel;

  constructor(channel: CommunicationChannel, private _connDataService$: ConnectionsDataService, tools: HandlerTools) 
  {
    super(tools);
    this._init(channel);
  }

  protected _init(channel: CommunicationChannel) {
    this._docPath = `orgs/${channel.orgId}/stories/${channel.defaultStory}/blocks`;
    this._channel = channel;
  }

  /** Gets the full block using the id */
  async getBlockById(id: string): Promise<Block> {
    const block: Block = await this.getDocumentById(id, this._docPath);

    if (!block) {
      throw new Error('Block does not exist');
    }

    return block;
  }

  /** TODO: Remove after implementing a static block on front end */
  async getAnchorBlock(channelInfo: CommunicationChannel): Promise<StoryBlock> {
    const anchorBlock = await this.getBlockById(channelInfo.defaultStory);

    if (!anchorBlock) {
      throw new Error('Failed to get first block');
    }
    return anchorBlock;
  }

  /** Gets the first block using the story ID.
   *  First gets the connection where sourceId == story id, then uses the target id of the connection to return the first block
   */
  async getFirstBlock(channelInfo: CommunicationChannel): Promise<StoryBlock> {
    const firstConnection = await this._connDataService$.getConnBySourceId(channelInfo.defaultStory);

    const firstBlock = await this.getBlockById(firstConnection.targetId);

    if (!firstBlock) {
      throw new Error('Failed to get first block');
    }
    return firstBlock;
  }
}

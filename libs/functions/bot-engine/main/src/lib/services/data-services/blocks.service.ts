import { Query } from '@ngfi/firestore-qbuilder';
import { HandlerTools } from '@iote/cqrs';

import { Block } from '@app/model/convs-mgr/conversations/chats';
import { StoryBlock } from '@app/model/convs-mgr/stories/blocks/main';
import { BaseMessage } from '@app/model/convs-mgr/conversations/messages';
import { BotDataService } from './data-service-abstract.class';
import { ConnectionsDataService } from './connections.service';
import { BaseChannel } from '@app/model/bot/channel';

/**
 * Contains all the required database flow methods for writing and reading blocks information
 */
export class BlockDataService extends BotDataService<StoryBlock> {
  private _docPath: string;
  private _channel: BaseChannel;

  constructor(channel: BaseChannel, private _connDataService$: ConnectionsDataService, tools: HandlerTools) 
  {
    super(tools);
    this._init(channel);
  }

  protected _init(channel: BaseChannel) {
    this._docPath = `orgs/${channel.orgId}/stories/${channel.storyId}/blocks`;
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
  async getAnchorBlock(channelInfo: BaseChannel): Promise<StoryBlock> {
    const anchorBlock = await this.getBlockById(channelInfo.storyId);

    if (!anchorBlock) {
      throw new Error('Failed to get first block');
    }
    return anchorBlock;
  }

  /** Gets the first block using the story ID.
   *  First gets the connection where sourceId == story id, then uses the target id of the connection to return the first block
   */
  async getFirstBlock(channelInfo: BaseChannel): Promise<StoryBlock> {
    const firstConnection = await this._connDataService$.getConnBySourceId(channelInfo.storyId);

    const firstBlock = await this.getBlockById(firstConnection.targetId);

    if (!firstBlock) {
      throw new Error('Failed to get first block');
    }
    return firstBlock;
  }
}

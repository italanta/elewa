import { HandlerTools } from '@iote/cqrs';

import { StoryBlock } from '@app/model/convs-mgr/stories/blocks/main';
import { CommunicationChannel } from '@app/model/convs-mgr/conversations/admin/system';

import { BotDataService } from './data-service-abstract.class';
import { ConnectionsDataService } from './connections.service';


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
  async getBlockById(id: string): Promise<StoryBlock> {

    return this.getDocumentById(id, this._docPath);

  }

  /** Gets the first block using the story ID.
   *  First gets the connection where sourceId == story id, then uses the target id of the connection to return the first block
   */
  async getFirstBlock(channelInfo: CommunicationChannel): Promise<StoryBlock> {
    const firstConnection = await this._connDataService$.getConnBySourceId(channelInfo.defaultStory);

    const firstBlock = await this.getBlockById(firstConnection.targetId);

    return firstBlock;
  }
}

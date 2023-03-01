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
  private tools: HandlerTools;

  constructor(channel: CommunicationChannel, private _connDataService$: ConnectionsDataService, tools: HandlerTools) 
  {
    super(tools);
    this._init(channel);
    this.tools = tools;
  }

  protected _init(channel: CommunicationChannel) {
    // this._docPath = `orgs/${channel.orgId}/stories/${channel.currentStory}/blocks`;
    this._channel = channel;
  }

  /** Gets the full block using the id */
  async getBlockById(id: string, orgId: string, currentStory: string): Promise<StoryBlock> {

     this._docPath = `orgs/${orgId}/stories/${currentStory}/blocks`;

    return this.getDocumentById(id, this._docPath);

  }

  /** Gets the first block using the story ID.
   *  First gets the connection where sourceId == story id, then uses the target id of the connection to return the first block
   */
  async getFirstBlock(orgId: string, storyId: string): Promise<StoryBlock> {

    this.tools.Logger.log(()=> `Getting first block for story: ${storyId}`);
    
    const firstConnection = await this._connDataService$.getFirstConnection(storyId);

    this.tools.Logger.log(()=> `First Connection: ${JSON.stringify(firstConnection)}`);

    const firstBlock = await this.getBlockById(firstConnection.targetId, orgId,storyId);

    return firstBlock;
  }
}

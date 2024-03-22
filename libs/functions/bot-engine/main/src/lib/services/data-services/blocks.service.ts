import { HandlerTools } from '@iote/cqrs';

import { StoryBlock, StoryBlockTypes, isMediaBlock } from '@app/model/convs-mgr/stories/blocks/main';
import { CommunicationChannel } from '@app/model/convs-mgr/conversations/admin/system';

import { BotDataService } from './data-service-abstract.class';
import { ConnectionsDataService } from './connections.service';
import { JumpBlock } from '@app/model/convs-mgr/stories/blocks/messaging';


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

    if(!id) return null;
    
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

  async getAllMediaBlocks(orgId: string, storyId: string) {

    let jumpBlocks: JumpBlock[] = [];
    let mediaBlocks: any[] = [];
    let allBlocks: StoryBlock[] = [];

    this._docPath = `orgs/${orgId}/stories/${storyId}/blocks`;

    allBlocks = await this.getDocuments(this._docPath)

    mediaBlocks = allBlocks
                      .filter(block => isMediaBlock(block.type) && block.deleted !== true)
                        .map(block => {
                          return {
                            data: block,
                            storyId: storyId
                          }
                        });

    jumpBlocks = allBlocks.filter(block => block.type === StoryBlockTypes.JumpBlock && block.deleted !== true);

    this.tools.Logger.log(()=> `Found ${jumpBlocks.length} Jump Blocks. Will now get the media blocks from the linked stories`);

    // Filter out the jump blocks that have already been processed
    //  Because the jump blocks can be linked back to the starting story
    //    causing an infinite loop
    let processedJumpBlockIds = [];

    // Go through the jump blocks and get the media blocks from the linked stories
    while (jumpBlocks.length > 0) {
      const jumpBlock = jumpBlocks.shift();

      // Add the jump block to the processed list
      processedJumpBlockIds.push(jumpBlock.id);

      if(jumpBlock.targetStoryId) {

        this.tools.Logger.log(()=> `In jump block id: ${jumpBlock.id}, target story id: ${jumpBlock.targetStoryId}`);

        const jumpDocPath = `orgs/${orgId}/stories/${jumpBlock.targetStoryId}/blocks`;

        const linkedStoryBlocks = await this.getDocuments(jumpDocPath);

        // Filter out jump blocks and media blocks in the linked story
        const newJumpBlocks = linkedStoryBlocks.filter(block => this.__filterJumpBlocks(block, processedJumpBlockIds));
        const newMediaBlocks = linkedStoryBlocks
                                .filter(block => isMediaBlock(block.type) && block.deleted !== true)
                                    .map(block => {
                                      return {
                                        data: block,
                                        storyId: jumpBlock.targetStoryId
                                      }
                                    });

        this.tools.Logger.log(() => `New Jump Blocks: ${newJumpBlocks.length}`);
        this.tools.Logger.log(() => `Old Jump Blocks: ${jumpBlocks.length}`);
  
        // Add the new media blocks to the existing blocks
        mediaBlocks = [...mediaBlocks, ...newMediaBlocks];
  
        // Add the new jump blocks to the existing ones
        jumpBlocks = [...jumpBlocks, ...newJumpBlocks];

        this.tools.Logger.log(() => `Current Jump Blocks: ${jumpBlocks.length}`);
      }
    }

    this.tools.Logger.log(()=> `Found ${mediaBlocks.length} Media Blocks`);

    return mediaBlocks;
  }

  async updateBlock(orgId: string, storyId: string, block: StoryBlock): Promise<StoryBlock> {
    this._docPath = `orgs/${orgId}/stories/${storyId}/blocks`;

    return this.updateDocument(block, this._docPath);
  }

  private __filterJumpBlocks(block: StoryBlock, processedJumpBlocks: string[]): boolean {
    return block.type === StoryBlockTypes.JumpBlock && block.deleted !== true && !processedJumpBlocks.includes(block.id);
  }
}

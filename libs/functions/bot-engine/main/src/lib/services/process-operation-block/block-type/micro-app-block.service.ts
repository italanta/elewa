import { Logger } from "@iote/bricks-angular";
import { HandlerTools } from "@iote/cqrs";

import { StoryBlock, StoryBlockTypes } from "@app/model/convs-mgr/stories/blocks/main";
import { Cursor, RoutedCursor } from "@app/model/convs-mgr/conversations/admin/system";
import { EndUser } from "@app/model/convs-mgr/conversations/chats";

import { InteractiveURLButtonBlock, MicroAppBlock } from "@app/model/convs-mgr/stories/blocks/messaging";
import { IProcessOperationBlock } from "../models/process-operation-block.interface";

import { BlockDataService } from "../../data-services/blocks.service";
import { ConnectionsDataService } from "../../data-services/connections.service";

export class MicroAppBlockService implements IProcessOperationBlock
{
  sideOperations: Promise<any>[] = [];
  userInput: string;
  _logger: Logger;
  blockDataService: BlockDataService;
  connDataService: ConnectionsDataService;
  tools: HandlerTools;

  constructor( blockDataService: BlockDataService, connDataService: ConnectionsDataService, tools: HandlerTools,
	) {
		this.connDataService =connDataService
		this.tools = tools;
		this.blockDataService = blockDataService;
	}

  public async handleBlock(storyBlock: StoryBlock, updatedCursor: Cursor, orgId: string, endUser: EndUser){
    // 1. Create the interactive btn block - return this + updated cursor
    // 2. Update bot status: Change from running to microApp
    // 3. Create microapp link, then pass the link to the link param in _createInteractiveButtonBlock (Link will have query params)
    /**
     * 4. Update cursor 
     * Take the current cursor and add it to the start of the parentStack
     * New updated position will be the id of the microapp block and the storyId
     * (storyId, blockSuccess)
     *  */ 

    const currentStory = updatedCursor.position.storyId;

    const nextPosition = await this.connDataService.getConnBySourceId(storyBlock.id, orgId, currentStory)
    const  nextCursorId = nextPosition.targetId

    const positionToUpdate: RoutedCursor = {
      storyId: currentStory,
      blockSuccess: nextCursorId 
    }
  
    const nextCursor= updatedCursor.parentStack.unshift(positionToUpdate)
    
    this.tools.Logger.log(()=> `👉🏾 The next cursor's value is ${nextCursor}`)

    const btnBlock = this._createInteractiveButtonBlock('', '')

    return { storyBlock: btnBlock,
             nextCursor
            }

  }
  
  /** Generating a URL button link that will be passed to the MicroApp block */
  private _createInteractiveButtonBlock(link: string, message: string): StoryBlock {

    const callToActionURL: InteractiveURLButtonBlock = {
      url: link,
      urlDisplayText: message,
      type: StoryBlockTypes.InteractiveUrlButtonBlock,
      position: null,
      deleted: false,
      blockTitle: "",
      blockIcon: ""
    }

     return callToActionURL
  }
  
  /** Link param that will be passed to __createInteractiveButtonBlock */
  private _getMicroAppLink(){}
} 

import { v4 as ___guid } from 'uuid'
import { Logger } from "@iote/bricks-angular";
import { HandlerTools } from "@iote/cqrs";

import { StoryBlock, StoryBlockTypes } from "@app/model/convs-mgr/stories/blocks/main";
import { Cursor, EndUserPosition, RoutedCursor } from "@app/model/convs-mgr/conversations/admin/system";
import { ChatStatus, EndUser } from "@app/model/convs-mgr/conversations/chats";
import { InteractiveURLButtonBlock, MicroAppBlock } from "@app/model/convs-mgr/stories/blocks/messaging";
import { MicroAppConfig, MicroAppStatus, MicroAppStatusTypes } from "@app/model/convs-mgr/micro-app/base";

import { IProcessOperationBlock } from "../models/process-operation-block.interface";

import { BlockDataService } from "../../data-services/blocks.service";
import { ConnectionsDataService } from "../../data-services/connections.service";
import { EndUserDataService } from "../../data-services/end-user.service";

export class MicroAppBlockService implements IProcessOperationBlock
{
  sideOperations: Promise<any>[] = [];
  userInput: string;
  _logger: Logger;
  blockDataService: BlockDataService;
  connDataService: ConnectionsDataService;
  tools: HandlerTools;

  constructor(blockDataService: BlockDataService, connDataService: ConnectionsDataService, tools: HandlerTools,
  )
  {
    this.connDataService = connDataService;
    this.tools = tools;
    this.blockDataService = blockDataService;
  }

  public async handleBlock(storyBlock: MicroAppBlock, updatedCursor: Cursor, orgId: string, endUser: EndUser)
  {
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

    const nextPosition = await this.connDataService.getConnBySourceId(storyBlock.id, orgId, currentStory);
    const nextBlockId = nextPosition.targetId;

    // The next default block to route to after the micro-app is complete
    const routedCursor: RoutedCursor = {
      storyId: currentStory,
      blockSuccess: nextBlockId
    };

    const newPosition: EndUserPosition = {
      // Id of the micro-app as the story id
      storyId: storyBlock.appId,

      // Id of the micro-app block
      blockId: storyBlock.id
    };
    // Update the cursor to show that we are on the micro app block
    updatedCursor.position = newPosition;
    const nextCursor = updatedCursor;
    this.tools.Logger.log(() => `👉🏾 The next cursor's value is ${nextCursor}`);

    // Register the app onto firestore
    const appRegistration: MicroAppStatus = {
      id: ___guid(),
      appId: storyBlock.appId,
      
      status: MicroAppStatusTypes.Initialized,

      config: storyBlock.configs,
      endUserId: endUser.id
    };

    const appRepo$ = this.tools.getRepository<MicroAppStatus>(`appExecs`);
    appRepo$.create(appRegistration, appRegistration.id);

    // Generate URL for micro-app
    const baseUrl = process.env.MICRO_APP_URL;
    const microAppLink = `${baseUrl}/${appRegistration.id}`;

    // Create the url button to be sent to the user.
    const ctaBlock = this._createInteractiveButtonBlock(microAppLink, storyBlock.message, storyBlock.appName);

    // Update bot engine status to Micro-app
    await this._updateBotStatus(orgId, endUser);

    return {
      storyBlock: ctaBlock,
      nextCursor
    };
  }

  /** Generating a URL button link that will be passed to the MicroApp block */
  private _createInteractiveButtonBlock(link: string, message: string, name: string): StoryBlock
  {

    const callToActionURL: InteractiveURLButtonBlock = {
      url: link,

      // TODO: Move this to front-end for custom display text 
      urlDisplayText: 'Click to Start',
      bodyText: message,

      // Name of the micro app as the footer text in this message
      footerText: name,
      type: StoryBlockTypes.InteractiveUrlButtonBlock,
      position: null,
      deleted: false,
      blockTitle: "",
      blockIcon: ""
    };

    return callToActionURL;
  }

  private _updateBotStatus(orgId: string, endUser: EndUser)
  {
    const endUserService = new EndUserDataService(this.tools, orgId);
    endUser.status = ChatStatus.MicroApp;

    return endUserService.updateEndUser(endUser);
  }

} 

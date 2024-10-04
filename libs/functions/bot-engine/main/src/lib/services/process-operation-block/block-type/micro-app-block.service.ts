import { v4 as ___guid } from 'uuid'
import { Logger } from "@iote/bricks-angular";
import { HandlerTools } from "@iote/cqrs";

import { StoryBlock, StoryBlockTypes } from "@app/model/convs-mgr/stories/blocks/main";
import { Cursor, EndUserPosition } from "@app/model/convs-mgr/conversations/admin/system";
import { EndUser } from "@app/model/convs-mgr/conversations/chats";
import { InteractiveURLButtonBlock, MicroAppBlock } from "@app/model/convs-mgr/stories/blocks/messaging";
import { MicroApp, MicroAppStatus, MicroAppStatusTypes } from "@app/model/convs-mgr/micro-app/base";
import { Organisation } from '@app/model/organisation';

import { IProcessOperationBlock } from "../models/process-operation-block.interface";

import { BlockDataService } from "../../data-services/blocks.service";
import { ConnectionsDataService } from "../../data-services/connections.service";
import { ActiveChannel } from '../../../model/active-channel.service';

export class MicroAppBlockService implements IProcessOperationBlock
{
  sideOperations: Promise<any>[] = [];
  userInput: string;
  _logger: Logger;
 
  constructor(
    private blockDataService: BlockDataService, 
    private connDataService: ConnectionsDataService, 
    private tools: HandlerTools,
    private _activeChannel: ActiveChannel
  )
  { }

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

    const newPosition: EndUserPosition = {
      // Id of the micro-app as the story id
      storyId: currentStory,

      // Id of the micro-app block
      blockId: storyBlock.id
    };
    // Update the cursor to show that we are on the micro app block
    updatedCursor.position = newPosition;
    const nextCursor = updatedCursor;
    this.tools.Logger.log(() => `👉🏾 The next cursor's value is ${JSON.stringify(nextCursor)}`);

    // Get organisation logo to be used within the micro-app
    const logoUrl = await this._getLogoUrl(orgId);

    const config: MicroApp = {
      type: storyBlock.appType,
      channel: this._activeChannel.channel,
      orgId, pos: newPosition,
      orgLogoUrl: logoUrl || '',
      storyId: storyBlock.storyId,
      moduleId: storyBlock.moduleId,
      botId: storyBlock.botId
    } 

    // Register the app onto firestore
    const appRegistration: MicroAppStatus = {
      id: ___guid(),
      appId: storyBlock.appId,
      
      status: MicroAppStatusTypes.Initialized,

      config: config,
      endUserId: endUser.id,
      endUserName: endUser.variables ? endUser.variables['name'] || '' : ''
    };
    

    const appRepo$ = this.tools.getRepository<MicroAppStatus>(`appExecs`);
    appRepo$.create(appRegistration, appRegistration.id);

    // Generate URL for micro-app
    const baseUrl = process.env.MICRO_APP_URL;
    const microAppLink = `${baseUrl}/start/${appRegistration.id}`;

    // Create the url button to be sent to the user.
    const ctaBlock = this._createInteractiveButtonBlock(microAppLink, storyBlock.message, storyBlock.name);
    return {
      storyBlock: ctaBlock,
      newCursor: nextCursor
    };
  }

  /** Generating a URL button link that will be passed to the MicroApp block */
  private _createInteractiveButtonBlock(link: string, message: string, name: string): StoryBlock
  {

    const callToActionURL: InteractiveURLButtonBlock = {
      url: link,

      // TODO: Move this to front-end for custom display text 
      urlDisplayText: 'Click to Start',
      message: message,

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

  private async _getLogoUrl(orgId: string) {
    const orgRepo = this.tools.getRepository<Organisation>(`orgs`);
    const org = await orgRepo.getDocumentById(orgId);

    return org.logoUrl;
  }
} 

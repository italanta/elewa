import * as _ from "lodash";

import { Query } from "@ngfi/firestore-qbuilder";
import { HandlerTools } from "@iote/cqrs";

import { CommunicationChannel, Cursor } from "@app/model/convs-mgr/conversations/admin/system";
import { StoryBlock, StoryBlockTypes } from "@app/model/convs-mgr/stories/blocks/main";
import { Button, QuestionMessageBlock } from "@app/model/convs-mgr/stories/blocks/messaging";
import { ButtonsBlockButton } from "@app/model/convs-mgr/stories/blocks/scenario";
import { Message, QuestionMessage } from "@app/model/convs-mgr/conversations/messages";
import { DialogflowCXIntent, FallBackActionTypes, RouteAction } from "@app/model/convs-mgr/fallbacks";
import { IntentFallbackService } from "@app/private/functions/intent-fallback-handler";
import { Story } from "@app/model/convs-mgr/stories/main";
 
import { BlockDataService } from "../../data-services/blocks.service";
// import { DialogflowCXIntent } from "libs/functions/intent/src/lib/models/dialogflow-cx-Intent.model";
 
export class FallBackBlockService
{
  intentFallbackService: IntentFallbackService;
  _handlerTools: HandlerTools;
  constructor(tools: HandlerTools) {
    this.intentFallbackService = new IntentFallbackService();
    this._handlerTools = tools;
  }
  getBlock(failedBlockId: string)
  {
    /**
     * The fall back block will reuse the structure of the question block. But
     *   they block type is different so that we can handle it differently on
     *    the operation block level.
     */
    const block: QuestionMessageBlock = {
      id: `${failedBlockId}-fallback-${Date.now()}`,
      type: StoryBlockTypes.FallbackBlock,
      position: null,
      deleted: false,
      blockTitle: '',
      blockIcon: '',
      message: `Sorry, I could not understand your message. Please select what you want to do:`,
      options: this.__getFallBackOptions()
    };
    return block;
  }
 
  private __getFallBackOptions()
  {
    const fallBackOptions: ButtonsBlockButton<Button>[] = [
      {
        id: "1",
        message: "Resend Last Message",
      },
      {
        id: "2",
        message: "Restart Story",
      },
      {
        id: "3",
        message: "Restart Conversation",
      },
    ];
 
    return fallBackOptions;
  }
 
  async oldFallBack(channel: CommunicationChannel, currentCursor: Cursor, blockDataService: BlockDataService, message: Message)
  {
    const newCursor = currentCursor;
    let nextBlock: StoryBlock;
 
    const response =  message as QuestionMessage;
    const firstStory = channel.defaultStory;
    const orgId = channel.orgId;
    const currentStory = currentCursor.position.storyId;
    const lastBlockId = currentCursor.position.blockId.split('-')[0];
    
    if(!response.options) {
      newCursor.position.blockId = lastBlockId;
      nextBlock = await blockDataService.getBlockById(lastBlockId, orgId, currentStory);
      return { nextBlock, newCursor };
    }
 
    switch (response.options[0].optionId) {
      case '1':
        // Resend the last block
        newCursor.position.blockId = lastBlockId;
        nextBlock = await blockDataService.getBlockById(lastBlockId, orgId, currentStory);
        break;
      case '2':
        // Restart the current lesson
        nextBlock = await blockDataService.getFirstBlock(orgId, currentStory);
 
        newCursor.position.blockId = nextBlock.id;
        break;  
      case '3':
        // Restart the conversation from the beginning
        nextBlock = await blockDataService.getFirstBlock(orgId, firstStory);
        newCursor.position.blockId = nextBlock.id;
        newCursor.position.storyId = firstStory;
        break;
      default:
        // Resend the last block
        nextBlock = await blockDataService.getBlockById(lastBlockId, orgId, currentStory);
        newCursor.position.blockId = lastBlockId;
        break;
    }
 
    return {
      nextBlock,
      newCursor
    };
  }
 
  async fallBack(channel: CommunicationChannel, currentCursor: Cursor, blockDataService: BlockDataService, message: Message){
    let nextBlock: StoryBlock;
    const orgId = channel.orgId;
    const newCursor = currentCursor;
    const storyId = currentCursor.position.storyId;

    const intentRepo = this._handlerTools.getRepository<DialogflowCXIntent>(`orgs/${orgId}/fallbacks`);

    // Get the parent module
    const parentModule = await this._getModuleByStory(orgId, storyId, this._handlerTools);

    if(!parentModule) {
      throw `FallBackBlockService - Parent module for ${storyId} not found`
    }

    // Get intents linked to that module
    const savedFallbacks = await intentRepo.getDocuments(new Query().where('moduleId', '==', parentModule));

    const userInputsArr = savedFallbacks.map((fb)=> fb.userInput);

    const userInputs = _.flatten(userInputsArr);

    const intentFallBackService = new IntentFallbackService();

    const intent = await intentFallBackService.detectIntentAndRespond(message.payload, userInputs);

    if(intent && typeof(intent) !== 'number') {
      const intentResponse = await intentRepo.getDocumentById(intent.name);
      const action = intentResponse.actionsType;

      // TODO: Implement other fallback action types
      if(action === FallBackActionTypes.Route) {
        const routeAction = intentResponse.actionDetails as RouteAction;
        nextBlock = routeAction.block;
        // If the story id is different, then we are jumping to another story, so we update the routed cursor
        newCursor.position = {
          storyId: routeAction.storyId,
          blockId: nextBlock.id
        }
      } else if(action === FallBackActionTypes.ResendLastMessage) {
        const lastBlockId = currentCursor.position.blockId;
        const lastBlock = await blockDataService.getBlockById(lastBlockId, orgId, storyId);
        nextBlock = lastBlock;
        newCursor.position.blockId = nextBlock.id;
      }
    }
    return {
      nextBlock,
      newCursor
    }
  }
 
  private async _getModuleByStory(orgId: string, storyId: string, handlerTools: HandlerTools): Promise<string>{
    const storyRepo = await handlerTools.getRepository<Story>(`orgs/${orgId}/stories`);
    const story = await storyRepo.getDocumentById(storyId);
    if(!story) {
      throw `FallBackBlockService - Story with ${storyId} not found`
    }
    return story.parentModule;
  }
}
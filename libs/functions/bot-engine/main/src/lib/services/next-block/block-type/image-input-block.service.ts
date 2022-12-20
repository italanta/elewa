import { HandlerTools, Logger } from "@iote/cqrs";

import { FileMessage, Message } from "@app/model/convs-mgr/conversations/messages";
import { StoryBlock } from "@app/model/convs-mgr/stories/blocks/main";
import { MessageTypes } from "@app/model/convs-mgr/functions";

import { BlockDataService } from "../../data-services/blocks.service";
import { ConnectionsDataService } from "../../data-services/connections.service";

import { DefaultOptionMessageService } from "./default-block.service";


/**
 * When an end user send a message to the bot, we need to know the type of block @see {StoryBlockTypes} we sent 
 *  so that we can process the response based on that block.
 * 
 * This service processes a location input from the user.
 * 
 */
export class ImageInputInputBlockService extends DefaultOptionMessageService
{
	userInput: string;
	_logger: Logger;
	tools: HandlerTools;

	constructor(blockDataService: BlockDataService, connDataService: ConnectionsDataService, tools: HandlerTools)
	{
		super(blockDataService, connDataService, tools);
		this.tools = tools;
	}

	/**
	 * When the bot engine receives a message from the end user, we will need to process that message e.g. 
	 * 	validate it, save the response, and return the next block in the story.
	 * 
	 * TODO: Move the validation to a separate procedure.
	 */
	async processUserInput(msg: Message, lastBlock: StoryBlock, orgId: string, currentStory: string, endUserId: string)
	{
		if (msg.type !== MessageTypes.IMAGE) return this.getErrorBlock(lastBlock.id, "Sorry, please send an image");


		await this.saveUserResponse(msg, lastBlock, orgId, endUserId);

		return this.getNextBlock(msg, lastBlock, orgId, currentStory, endUserId);
	}

	/**
	 * The user/organisation creating the bot might choose to save the response of the end user for later use.
	 * 
	 * This method takes the response(value) and saves it to a temporary collection. This data can then
   *  be retrieved from this collection later e.g. when the story ends the user creating the bot might choose to 
   *    post the data to a REST endpoint.
	 */
	protected async saveUserResponse(msg: Message, lastBlock: StoryBlock, orgId: string, endUserId: string): Promise<any>
	{
		const fileMessage = msg as FileMessage;

		if (lastBlock.milestone) return this.saveData(lastBlock.tag, orgId ,lastBlock.milestone, fileMessage.mediaId, endUserId);
	}
}
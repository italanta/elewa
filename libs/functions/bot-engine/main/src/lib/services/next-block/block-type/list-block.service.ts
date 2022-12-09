import { HandlerTools, Logger } from "@iote/cqrs";

import { Message, QuestionMessage } from "@app/model/convs-mgr/conversations/messages";
import { StoryBlock } from "@app/model/convs-mgr/stories/blocks/main";

import { BlockDataService } from "../../data-services/blocks.service";
import { ConnectionsDataService } from "../../data-services/connections.service";

import { MultipleOptionsMessageService } from "./multiple-options-block.service";

/**
 * When an end user send a message to the bot, we need to know the type of block @see {StoryBlockTypes} we sent 
 *  so that we can process the response based on that block.
 * 
 * This service manages those blocks that have only the default option(Only one connection originates from them)
 *  Therefore for these blocks, we already know the next block to send regardless of the user response
 * 
 */
export class ListBlockService extends MultipleOptionsMessageService
{
	userInput: string;
	_logger: Logger;
	tools: HandlerTools;

	constructor(blockDataService: BlockDataService,
		connDataService: ConnectionsDataService,
		tools: HandlerTools)
	{
		super(blockDataService, connDataService, tools);
		this._logger = tools.Logger;
	}
	
	/**
	 * When the bot engine receives a message from the end user, we will need to process that message e.g. 
	 * 	validate it, save the response, and return the next block in the story.
	 * 
	 * TODO: Move the validation to a separate procedure.
	 */
	async processUserInput(msg: Message, lastBlock: StoryBlock, orgId: string, currentStory: string, endUserId: string)
	{
		await this.saveUserResponse(msg, lastBlock, orgId, endUserId);

		return this.getNextBlock(msg, lastBlock, orgId, currentStory, endUserId);
	}
}
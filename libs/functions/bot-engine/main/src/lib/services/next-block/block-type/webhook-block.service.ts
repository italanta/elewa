import { HandlerTools, Logger } from "@iote/cqrs";

import { Message, TextMessage } from "@app/model/convs-mgr/conversations/messages";
import { StoryBlock } from "@app/model/convs-mgr/stories/blocks/main";

import { BlockDataService } from "../../data-services/blocks.service";
import { ConnectionsDataService } from "../../data-services/connections.service";
import { NextBlockService } from "../next-block.class";

/**
 * When an end user send a message to the bot, we need to know the type of block @see {StoryBlockTypes} we sent 
 *  so that we can process the response based on that block.
 * 
 * This service manages those blocks that have multiple options. It determines the next block in the story based
 * 	on the option selected by the end user.
 */
export class WebhookBlockService extends NextBlockService
{
	userInput: string;
	_logger: Logger;
	tools: HandlerTools;

	constructor(private _blockDataService: BlockDataService, private _connDataService: ConnectionsDataService, tools: HandlerTools)
	{
		super(tools);
		this.tools = tools;
	}

	/**
	 * Gets the next block in the story linked to the option selected by the end user
	 * 
	 * @note It does this by matching the id of the button and the id of the option saved in the database
	 */
	async getNextBlock(msg: Message, lastBlock: StoryBlock, orgId: string, currentStory: string, endUserId: string): Promise<StoryBlock>
	{
		let nextBlock: StoryBlock;
		// Get the connection
		const connection = await this._connDataService.getConnBySourceId(lastBlock.id, orgId, currentStory);
		// Get the next block using the id. Connection.targetId == id of the next block
		if (connection)
			nextBlock = await this._blockDataService.getBlockById(connection.targetId, orgId, currentStory);

		return nextBlock;
	}
	protected async saveUserResponse(msg: Message, lastBlock: StoryBlock, orgId: string, endUserId: string): Promise<any>
	{
		const textMessage = msg as TextMessage;

		if (lastBlock.milestone) return this.saveData(lastBlock.tag, orgId, lastBlock.milestone, textMessage.text, endUserId);
	}
}
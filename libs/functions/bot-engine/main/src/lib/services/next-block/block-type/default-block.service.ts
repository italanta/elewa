import { HandlerTools, Logger } from "@iote/cqrs";

import { Message, TextMessage } from "@app/model/convs-mgr/conversations/messages";
import { StoryBlock } from "@app/model/convs-mgr/stories/blocks/main";

import { BlockDataService } from "../../data-services/blocks.service";
import { ConnectionsDataService } from "../../data-services/connections.service";
import { NextBlockService } from "../next-block.class";
import { Cursor, EndUserPosition } from "@app/model/convs-mgr/conversations/admin/system";

/**
 * When an end user send a message to the bot, we need to know the type of block @see {StoryBlockTypes} we sent 
 *  so that we can process the response based on that block.
 * 
 * This service manages those blocks that have only the default option(Only one connection originates from them)
 *  Therefore for these blocks, we already know the next block to send regardless of the user response
 * 
 */
export class DefaultOptionMessageService extends NextBlockService
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
	 * Gets the next block in the story linked to the default option
	 * 
	 * @note We can potentially know if the block is the last one if no connection originates from it (connnection == null)
	 */
	async getNextBlock(msg: Message, currentCursor: Cursor, currentBlock: StoryBlock, orgId: string, currentStory: string, endUserId: string): Promise<Cursor>
	{
		const cursor = currentCursor;

		const lastBlockId = currentCursor.position.blockId;

		// Get the connection
		const connection = await this._connDataService.getConnBySourceId(lastBlockId, orgId, currentStory);

		this.tools.Logger.log(()=> `Connection: ${JSON.stringify(connection)}`);
		// Get the next block using the id. Connection.targetId == id of the next block
		// if (connection)
		// 	nextBlock = await this._blockDataService.getBlockById(connection.targetId, orgId, currentStory);

			const newUserPosition: EndUserPosition = {
				storyId: currentStory,
				blockId: connection.targetId
			}
			cursor.position = newUserPosition;

		return cursor;
	}
}
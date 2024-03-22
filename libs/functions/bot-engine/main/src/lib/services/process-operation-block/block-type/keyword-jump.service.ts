import { HandlerTools } from "@iote/cqrs";

import { Cursor } from "@app/model/convs-mgr/conversations/admin/system";

import { WebhookBlock } from "@app/model/convs-mgr/stories/blocks/messaging";
import { Message } from "@app/model/convs-mgr/conversations/messages";

import { BlockDataService } from "../../data-services/blocks.service";
import { ConnectionsDataService } from "../../data-services/connections.service";

import { IProcessOperationBlock } from "../models/process-operation-block.interface";

import { MultipleOptionsMessageService } from "../../next-block/block-type/multiple-options-block.service";
import { EndUser } from "@app/model/convs-mgr/conversations/chats";
/**
 * When an end user send a message to the bot, we need to know the type of block @see {StoryBlockTypes} we sent 
 *  so that we can process the response based on that block.
 * 
 * This service processes a location input from the user.
 * 
 */
export class KeywordJumpBlockService extends MultipleOptionsMessageService implements IProcessOperationBlock
{
	sideOperations: Promise<any>[] = [];
	tools: HandlerTools;
	blockDataService: BlockDataService;

	constructor(blockDataService: BlockDataService, connDataService: ConnectionsDataService, tools: HandlerTools)
	{
		super(blockDataService, connDataService, tools);
		this.tools = tools;
		this.blockDataService = blockDataService;
	}

	public async handleBlock(storyBlock: WebhookBlock, updatedCursor: Cursor, orgId: string, endUser: EndUser, message: Message)
	{
		const newCursor = await this.getNextBlock(message, updatedCursor, storyBlock, orgId, updatedCursor.position.storyId, endUser.id, "matchText");

		const nextBlock = await this.blockDataService.getBlockById(newCursor.position.blockId, orgId, newCursor.position.storyId);

		return {
			storyBlock: nextBlock,
			newCursor
		};
	}
	


}
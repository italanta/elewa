import { HandlerTools } from "@iote/cqrs";

import { Cursor } from "@app/model/convs-mgr/conversations/admin/system";

import { Message, QuestionMessage } from "@app/model/convs-mgr/conversations/messages";
import { ConditionalBlock } from "@app/model/convs-mgr/stories/blocks/messaging";
import { MessageTypes } from "@app/model/convs-mgr/functions";

import { BlockDataService } from "../../data-services/blocks.service";
import { VariablesDataService } from "../../data-services/variables.service";
import { ConnectionsDataService } from "../../data-services/connections.service";

import { IProcessOperationBlock } from "../models/process-operation-block.interface";

import { MultipleOptionsMessageService } from "../../next-block/block-type/multiple-options-block.service";
/**
 * When an end user send a message to the bot, we need to know the type of block @see {StoryBlockTypes} we sent 
 *  so that we can process the response based on that block.
 * 
 * This service processes a conditional blocks variable value from the user.
 * 
 */
export class ConditionalBlockService extends MultipleOptionsMessageService implements IProcessOperationBlock
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

	public async handleBlock(storyBlock: ConditionalBlock, updatedCursor: Cursor, orgId: string, endUserId: string, _message:Message)
	{
		// get the selected or typed variable (only one is returned)
		const variableToCheck = storyBlock.selectedVar ? storyBlock.selectedVar : storyBlock.typedVar;

		// get variable value from DB
		const varDataService = new VariablesDataService(this.tools, orgId, endUserId);

		const variableValue = await varDataService.getSpecificVariable(variableToCheck);

		const newMessage: QuestionMessage = {
			questionText : variableValue,
			type: MessageTypes.TEXT,
			options : this.getOptions(storyBlock)
		}

		const newCursor = await this.getNextBlock(newMessage, updatedCursor, storyBlock, orgId, updatedCursor.position.storyId, endUserId, "matchText");

		const nextBlock = await this.blockDataService.getBlockById(newCursor.position.blockId, orgId, newCursor.position.storyId);

		return {
			storyBlock: nextBlock,
			newCursor
		};
	}

	private getOptions(storyBlock: ConditionalBlock) {
    return storyBlock.options.map((option) => ({
      optionId: option.id,
      optionText: option.message,
    }));
  }
}

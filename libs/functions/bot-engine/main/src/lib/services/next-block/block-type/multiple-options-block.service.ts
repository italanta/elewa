import { HandlerTools, Logger } from "@iote/cqrs";

import { Message, QuestionMessage } from "@app/model/convs-mgr/conversations/messages";
import { StoryBlock } from "@app/model/convs-mgr/stories/blocks/main";

import { BlockDataService } from "../../data-services/blocks.service";
import { ConnectionsDataService } from "../../data-services/connections.service";
import { NextBlockService } from "../next-block.class";
import { MatchInputService } from "../../match-input/match-input.service";
import { ExactMatch } from "../../match-input/strategies/exact-match.strategy";
import { QuestionMessageBlock } from "@app/model/convs-mgr/stories/blocks/messaging";

/**
 * When an end user send a message to the bot, we need to know the type of block @see {StoryBlockTypes} we sent 
 *  so that we can process the response based on that block.
 * 
 * This service manages those blocks that have only the default option(Only one connection originates from them)
 *  Therefore for these blocks, we already know the next block to send regardless of the user response
 * 
 */
export class MultipleOptionsMessageService extends NextBlockService
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
	async getNextBlock(msg: Message, lastBlock: QuestionMessageBlock, orgId: string, currentStory: string, endUserId: string): Promise<StoryBlock>
	{
		const response = msg as QuestionMessage;
		
		const matchInput = new MatchInputService();

		// Set the match strategy to exactMatch
		// TODO: Add a dynamic way of selecting matching strategies
		matchInput.setMatchStrategy(new ExactMatch());
	
		const selectedOptionIndex = matchInput.matchId(response.options[0].optionId, lastBlock.options);
	
		if (selectedOptionIndex == -1)
		{
				this._logger.error(() => `The message did not match any option found`);
		}
	
		const sourceId = `i-${selectedOptionIndex}-${lastBlock.id}`;
	
		const connection = await this._connDataService.getConnByOption(sourceId, orgId, currentStory);
	
		const nextBlock = await this._blockDataService.getBlockById(connection.targetId, orgId, currentStory);
	
		return nextBlock;
	}

	async saveUserResponse(msg: Message, lastBlock: StoryBlock, orgId: string, endUserId: string): Promise<any>
	{
		const response = msg as QuestionMessage;

		if (lastBlock.milestone) return this.saveData(lastBlock.tag, orgId, lastBlock.milestone, response.options[0].optionText, endUserId);
	}
}
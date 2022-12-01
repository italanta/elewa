import { HandlerTools, Logger } from "@iote/cqrs";

import { Message, QuestionMessage } from "@app/model/convs-mgr/conversations/messages";
import { StoryBlock } from "@app/model/convs-mgr/stories/blocks/main";
import { QuestionMessageBlock } from "@app/model/convs-mgr/stories/blocks/messaging";

import { BlockDataService } from "../../data-services/blocks.service";
import { ConnectionsDataService } from "../../data-services/connections.service";

import { NextBlockService } from "../next-block.class";

import { MatchInputService } from "../../match-input/match-input.service";
import { ExactMatch } from "../../match-input/strategies/exact-match.strategy";

/**
 * When an end user send a message to the bot, we need to know the type of block @see {StoryBlockTypes} we sent 
 *  so that we can process the response based on that block.
 * 
 * This service manages the question block, as the user input will determine the next block we send.
 *  Therefore we need to match the option selected by the user to the block that is connected to
 *    that block in the story.
 */
export class QuestionMessageService extends NextBlockService
{
	userInput: string;
	_logger: Logger;
	tools: HandlerTools;

	constructor(private _blockDataService: BlockDataService, 
							private _connDataService: ConnectionsDataService, 
							tools: HandlerTools)
	{
	super(tools);
	this._logger = tools.Logger;
	}

	/**
	 * When a user is sent a question block they are presented with buttons to choose, each
	 * 	button has an id and this id is the same as the
	 * 
	 * Gets the next block by using the id of the option selected by the user to find the connection
	 * 	linking us to the next block.
	 * 
	 * Uses a strategy pattern to choose the way which we match the response to the next block
	 * 
	 * TODO: Add a dynamic way of selecting matching strategies
	 */
	async getNextBlock(msg: Message, lastBlock: QuestionMessageBlock, orgId: string, currentStory: string, endUserId?: string): Promise<StoryBlock>
	{

	const response = msg as QuestionMessage;

	if (lastBlock.milestone)
	{
		await this.saveData(lastBlock.tag, orgId, lastBlock.milestone, response.options[0].optionText, endUserId)
	}

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
}
import { HandlerTools, Logger } from "@iote/cqrs";

import { Message, QuestionMessage } from "@app/model/convs-mgr/conversations/messages";
import { StoryBlock } from "@app/model/convs-mgr/stories/blocks/main";
import { QuestionMessageBlock } from "@app/model/convs-mgr/stories/blocks/messaging";

import { BlockDataService } from "../../data-services/blocks.service";
import { ConnectionsDataService } from "../../data-services/connections.service";
import { NextBlockService } from "../next-block.class";
import { MatchInputService } from "../../match-input/match-input.service";
import { ExactMatch } from "../../match-input/strategies/exact-match.strategy";
import { Cursor } from "@app/model/convs-mgr/conversations/admin/system";

/**
 * When an end user send a message to the bot, we need to know the type of block @see {StoryBlockTypes} we sent 
 *  so that we can process the response based on that block.
 * 
 * This service manages those blocks that have multiple options. It determines the next block in the story based
 * 	on the option selected by the end user.
 * 
 * Used for @type {QuestionMessageBlock} and @type {ListMessageBlock}
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
	 * Gets the next block in the story linked to the option selected by the end user
	 * 
	 * @note It does this by matching the id of the button and the id of the option saved in the database
	 */
	async getNextBlock(msg: Message, currentCursor: Cursor, currentBlock: StoryBlock, orgId: string, currentStory: string, endUserId: string): Promise<StoryBlock>
	{
		const response = msg as QuestionMessage;

		const matchInput = new MatchInputService();

		const lastBlock = currentBlock as QuestionMessageBlock

		// Set the match strategy to exactMatch
		// TODO: Add a dynamic way of selecting matching strategies
		matchInput.setMatchStrategy(new ExactMatch());

		const selectedOptionIndex = matchInput.matchId(response.options[0].optionId, lastBlock.options);

		if (selectedOptionIndex == -1) {
			this._logger.error(() => `The message did not match any option found`);
		}

		const sourceId = `i-${selectedOptionIndex}-${lastBlock.id}`;

		const connection = await this._connDataService.getConnByOption(sourceId, orgId, currentStory);

		const nextBlock = await this._blockDataService.getBlockById(connection.targetId, orgId, currentStory);

		return nextBlock;
	}

 /**
 	* The user/organisation creating the bot might choose to save the response of the end user for later use.
 	* 
 	* This method takes the response(value) and saves it to a temporary collection. This data can then
 	*  be retrieved from this collection later e.g. when the story ends the user creating the bot might choose to 
 	*    post the data to a REST endpoint.
	* 
	* Each story block will need to have a field called 'milestone', which we will use to group variables together.
	* 	A milestone is the end goal which the user wants to achieve with the saving variables. E.g. If the milestone is
	*			'reportproblem', the end user reponse to the input blocks with that milestone will be saved together.
	*
	* This will also help in knowing where to retrieve the data, when posting the data to an api endpoint.
 	*/
	async saveUserResponse(msg: Message, lastBlock: StoryBlock, orgId: string, endUserId: string): Promise<any>
	{
		const response = msg as QuestionMessage;

		// Get the text value of the option the end user has clicked
		const value = response.options[0].optionText;

		// Check if the milestone exists on this block
		if (lastBlock.milestone) return this.saveData(lastBlock.tag, orgId, lastBlock.milestone, value, endUserId);
	}
}
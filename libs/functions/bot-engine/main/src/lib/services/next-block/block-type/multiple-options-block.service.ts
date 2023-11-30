import * as _ from "lodash";

import { HandlerTools, Logger } from "@iote/cqrs";

import { Message, QuestionMessage } from "@app/model/convs-mgr/conversations/messages";
import { StoryBlock } from "@app/model/convs-mgr/stories/blocks/main";
import { QuestionMessageBlock } from "@app/model/convs-mgr/stories/blocks/messaging";
import { Cursor, EndUserPosition } from "@app/model/convs-mgr/conversations/admin/system";

import { BlockDataService } from "../../data-services/blocks.service";
import { ConnectionsDataService } from "../../data-services/connections.service";
import { NextBlockService } from "../next-block.class";
import { MatchInputService } from "../../match-input/match-input.service";
import { ExactMatch } from "../../match-input/strategies/exact-match.strategy";

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
	matchInput: MatchInputService;

	constructor(private _blockDataService: BlockDataService, private _connDataService: ConnectionsDataService, tools: HandlerTools)
	{
		super(tools);
		this.tools = tools;
		this.matchInput = new MatchInputService();
	}

	/**
	 * Gets the next block in the story linked to the option selected by the end user
	 * 
	 * @note It does this by matching the id of the button and the id of the option saved in the database
	 */
	async getNextBlock(msg: Message, currentCursor: Cursor, currentBlock: StoryBlock, orgId: string, currentStory: string, endUserId: string, type?: string): Promise<Cursor>
	{
		const cursor = currentCursor;
		
		const response = msg as QuestionMessage;
		
		const lastBlock = currentBlock as QuestionMessageBlock;

		// Set the match strategy to exactMatch
		// TODO: Add a dynamic way of selecting matching strategies
		this.matchInput.setMatchStrategy(new ExactMatch());

		if(!response.options) {
			currentCursor.position.blockId = null;
			return currentCursor;
		}

		const selectedOptionIndex = this.match(type || "matchId", response, lastBlock.options);

		if (selectedOptionIndex == -1) {
			return this.getNextBlockFromDefaultOption(lastBlock, orgId, currentStory, cursor);
		}

		const sourceId = `i-${selectedOptionIndex}-${lastBlock.id}`;

		const connection = await this._connDataService.getConnByOption(sourceId, orgId, currentStory);

		this.tools.Logger.log(()=> `Connection: ${JSON.stringify(connection)}`);

		const newUserPosition: EndUserPosition = {
			storyId: currentStory,
			blockId: connection ? connection.targetId : null
		}
		cursor.position = newUserPosition;

		return cursor;
	}

	match(type: string, message: QuestionMessage, options: any[])
	{
		switch (type) {
			case 'matchId':
				return this.matchInput.matchId(message.options[0].optionId, options);
			case 'matchText':
				return this.matchInput.matchText(message.questionText, options);
			default:
				return this.matchInput.matchId(message.options[0].optionId, options);
		}
	}

	private async getNextBlockFromDefaultOption(lastBlock: StoryBlock, orgId: string, currentStory: string, cursor: Cursor) {
		this.tools.Logger.log(() => `The message did not match any option found, finding next block from default connection`);

		// check for next block from default option
		const connection = await this._connDataService.getConnBySourceId(lastBlock.id, orgId, currentStory);

		if (!connection) {
			this.tools.Logger.error(() => `The message did not match any option and no default next block was found`)
		}

		const newUserPosition: EndUserPosition = {
			storyId: currentStory,
			blockId: connection ? connection.targetId : null
		}

		cursor.position = newUserPosition;

		return cursor;
	}
}

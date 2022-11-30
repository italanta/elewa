import { HandlerTools, Logger } from "@iote/cqrs";


import { ListBlock } from "@app/model/convs-mgr/stories/blocks/messaging";
import { Message, QuestionMessage } from "@app/model/convs-mgr/conversations/messages";
import { StoryBlock } from "@app/model/convs-mgr/stories/blocks/main";
import { EndUser } from "@app/model/convs-mgr/conversations/chats";

import { BlockDataService } from "../../data-services/blocks.service";
import { ConnectionsDataService } from "../../data-services/connections.service";
import { NextBlockService } from "../next-block.class";
import { EndUserDataService } from "../../data-services/end-user.service";
import { MatchInputService } from "../../match-input/match-input.service";
import { ExactMatch } from "../../match-input/strategies/exact-match.strategy";

/**
 * When an end user send a message to the bot, we need to know the type of block @see {StoryBlockTypes} we sent 
 *  so that we can process the response based on that block.
 * 
 * This service manages those blocks that have only the default option(Only one connection originates from them)
 *  Therefore for these blocks, we already know the next block to send regardless of the user response
 * 
 */
export class CropsListBlockService extends NextBlockService
{
	userInput: string;
	_logger: Logger;
	tools: HandlerTools;

	constructor(private _blockDataService: BlockDataService, private _connDataService: ConnectionsDataService, tools: HandlerTools)
	{
		super(tools);
		this.tools = tools;
	}

	async getNextBlock(msg: Message, lastBlock: CropListBlock, orgId: string, currentStory: string, endUserId?: string): Promise<StoryBlock>
	{
		let crops: string[];

		const replyMessage = msg as QuestionMessage;

		// const list = textMessage.text.split(',');

		const endUserService = new EndUserDataService(this.tools, 'farmbetter');

		const endUser = await endUserService.getEndUser(endUserId);

		crops = endUser.crops;

		if (crops) {
			crops.push(replyMessage.options[0].optionText);
		} else {
			crops = [replyMessage.options[0].optionText];
		}


		const newEndUser: EndUser = {
			...endUser,
			crops
		};

		await endUserService.updateEndUser(newEndUser);

		const matchInput = new MatchInputService();

		// Set the match strategy to exactMatch
		// TODO: Add a dynamic way of selecting matching strategies
		matchInput.setMatchStrategy(new ExactMatch());

		const selectedOptionIndex = matchInput.matchId(replyMessage.options[0].optionId, lastBlock.options);

		if (selectedOptionIndex == -1) {
			this._logger.error(() => `The message did not match any option found`);
		}

		const sourceId = `i-${selectedOptionIndex}-${lastBlock.id}`;

		const connection = await this._connDataService.getConnByOption(sourceId, orgId, currentStory);

		const nextBlock = await this._blockDataService.getBlockById(connection.targetId, orgId, currentStory);

		return nextBlock;
	}
}
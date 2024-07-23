import * as _ from "lodash";

import { HandlerTools, Logger } from "@iote/cqrs";

import { Message } from "@app/model/convs-mgr/conversations/messages";
import { AssessmentMicroAppBlock } from "@app/model/convs-mgr/stories/blocks/messaging";
import { Cursor } from "@app/model/convs-mgr/conversations/admin/system";
import { AssessmentProgress, AssessmentStatusTypes } from "@app/model/convs-mgr/micro-app/assessments";

import { BlockDataService } from "../../data-services/blocks.service";
import { ConnectionsDataService } from "../../data-services/connections.service";
import { NextBlockService } from "../next-block.class";
import { MatchInputService } from "../../match-input/match-input.service";

/**
 * When an end user send a message to the bot, we need to know the type of block @see {StoryBlockTypes} we sent 
 *  so that we can process the response based on that block.
 * 
 * This service manages those blocks that have multiple options. It determines the next block in the story based
 * 	on the option selected by the end user.
 * 
 * Used for @type {QuestionMessageBlock} and @type {ListMessageBlock}
 */
export class AssessmentMicroAppOptionsService extends NextBlockService
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
	async getNextBlock(msg: Message, currentCursor: Cursor, currentBlock: AssessmentMicroAppBlock, orgId: string, currentStory: string, endUserId: string, type?: string): Promise<Cursor>
	{
    // Get results
    const progressRepo$ = this.tools.getRepository<AssessmentProgress>(`orgs/${orgId}/end-users/${endUserId}`);
    const progress = await progressRepo$.getDocumentById(currentBlock.appId);
    
    const newCursor = {...currentCursor};

    const currentResult = progress.attempts[progress.attemptCount].outcome;

    let index = currentBlock.options.findIndex((op)=> op.value === currentResult);

    if(!index) {
      index = currentBlock.options.findIndex((op)=> op.value === AssessmentStatusTypes.Incomplete);
    }

    const sourceId = `i-${index}-${currentBlock.id}`;

    const conn = await this._connDataService.getConnByOption(sourceId, orgId, currentStory);

    const nextBlockId = conn ? conn.targetId : null;

    newCursor.position.blockId = nextBlockId;

		return newCursor;
	}
}

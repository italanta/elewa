import { HandlerTools } from "@iote/cqrs";

import { Cursor, EventsStack } from "@app/model/convs-mgr/conversations/admin/system";

import { Message } from "@app/model/convs-mgr/conversations/messages";
import { EventBlock } from "@app/model/convs-mgr/stories/blocks/messaging";
import { EndUser } from "@app/model/convs-mgr/conversations/chats";

import { BlockDataService } from "../../data-services/blocks.service";
import { ConnectionsDataService } from "../../data-services/connections.service";
import { EnrolledUserDataService } from "../../data-services/enrolled-user.service";

import { IProcessOperationBlock } from "../models/process-operation-block.interface";

import { DefaultOptionMessageService } from "../../next-block/block-type/default-block.service";
/**
 * When an end user send a message to the bot, we need to know the type of block @see {StoryBlockTypes} we sent 
 *  so that we can process the response based on that block.
 * 
 * This service processes an event block - we use it to track when our users reach certain parts of the course or achieve certain objectives..
 * 
 */
export class EventBlockService extends DefaultOptionMessageService implements IProcessOperationBlock
{
	sideOperations: Promise<any>[] = [];
	tools: HandlerTools;
	blockDataService: BlockDataService;
	enrolledUserService: EnrolledUserDataService;

	constructor(
		blockDataService: BlockDataService, 
		connDataService: ConnectionsDataService, 
		enrolledUserService: EnrolledUserDataService, 
		tools: HandlerTools
	) {
		super(blockDataService, connDataService, tools);
		this.tools = tools;
		this.blockDataService = blockDataService;
		this.enrolledUserService = enrolledUserService;
	}

	public async handleBlock(storyBlock: EventBlock, updatedCursor: Cursor, orgId: string, endUser: EndUser, _message:Message)
	{
		const newCursor = await this.getNextBlock(_message, updatedCursor, storyBlock, orgId, updatedCursor.position.storyId, endUser.id);

		const nextBlock = await this.blockDataService.getBlockById(newCursor.position.blockId, orgId, newCursor.position.storyId);

    const eventDetails: EventsStack = {
      uid: `${storyBlock.id}-event`,
      name: storyBlock.eventName,
      isMilestone: storyBlock.isMilestone,
      payload: storyBlock.payLoad ? storyBlock.payLoad : ""
    }

    // if first time recording event create the eventStack.
    if (!newCursor.eventsStack) newCursor.eventsStack = [];

    const eventExists = this.wasEventTracked(newCursor, eventDetails);

    if (!eventExists) {
			// if event does not exist add it.
			newCursor.eventsStack.unshift(eventDetails);

			// update the enrolled User's current course if event is marked as a milestone.
			if (eventDetails.isMilestone) {
				// add currentcourse
				this.tools.Logger.log(()=> `Updating enrolledUser's currentCourse: ${eventDetails.name}`);

				const enrolledUser = await this.enrolledUserService.getOrCreateEnrolledUser(endUser, 'whatsappEndUserId');

				// update currentcourse
				enrolledUser.currentCourse = eventDetails.name;

				// update User's current course
				await this.enrolledUserService.updateEnrolledUser(enrolledUser);
			};
		};

		return {
			storyBlock: nextBlock,
			newCursor
		};
	}

  /** Checks whether event was already tracked, why? incase a user re-does a story/course.*/
  private wasEventTracked(cursor: Cursor, event: EventsStack) {
    this.tools.Logger.log(()=> `Checking for Existence of event ${event.uid}`);

    return cursor.eventsStack.find(savedEvent => savedEvent.uid === event.uid)
  }
}

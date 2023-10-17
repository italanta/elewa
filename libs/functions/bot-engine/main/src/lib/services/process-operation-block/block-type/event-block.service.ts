import { HandlerTools } from "@iote/cqrs";

import { Cursor, EventsStack, MilestoneTriggers, PlatformType } from "@app/model/convs-mgr/conversations/admin/system";

import { Query } from "@ngfi/firestore-qbuilder";

import { Message, MessageDirection, TemplateMessage } from "@app/model/convs-mgr/conversations/messages";
import { EventBlock } from "@app/model/convs-mgr/stories/blocks/messaging";
import { EndUser } from "@app/model/convs-mgr/conversations/chats";

import { BlockDataService } from "../../data-services/blocks.service";
import { ConnectionsDataService } from "../../data-services/connections.service";
import { EndUserDataService } from "../../data-services/end-user.service";

import { IProcessOperationBlock } from "../models/process-operation-block.interface";

import { DefaultOptionMessageService } from "../../next-block/block-type/default-block.service";
import { SendOutgoingMsgHandler } from "@app/functions/bot-engine/send-message";
import { ChannelDataService } from "../../data-services/channel-info.service";
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

	constructor(
		blockDataService: BlockDataService, 
		connDataService: ConnectionsDataService,  
		tools: HandlerTools
	) {
		super(blockDataService, connDataService, tools);
		this.tools = tools;
		this.blockDataService = blockDataService;
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
				this.tools.Logger.log(()=> `Updating endUser's currentCourse: ${eventDetails.name}`);

				const endUserService = new EndUserDataService(this.tools, orgId);

				// Send a message template to the user if a trigger was set for this milestone
				await this._triggerMessage(eventDetails, endUser, orgId);

				// update currentcourse
				endUser.currentStory = eventDetails.name;

				// update User's current course
				await endUserService.updateEndUser(endUser);
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

	private async _triggerMessage(event: EventsStack, endUser: EndUser, orgId: string) {
		const n = parseInt(endUser.id.split('_')[1]);

		const milestonesTriggersRepo$ = this.tools.getRepository<MilestoneTriggers>(`orgs/${orgId}/milestones-triggers`);

		const trigger = await milestonesTriggersRepo$.getDocuments(new Query().where("name", "==", event.name));

		const channelService = new ChannelDataService(this.tools);

		const communicationChannel = await channelService.getChannelByConnection(n);

		if(trigger && trigger.length > 0) {
			const sendMessage = new SendOutgoingMsgHandler()

			let message: TemplateMessage = {
				...trigger[0].message,
				direction: MessageDirection.FROM_AGENT_TO_END_USER,
				n: parseInt(endUser.id.split('_')[1]),
			}

			message = this._assignRecipientID(message, endUser.id, communicationChannel.type);

			await sendMessage.execute(trigger[0].message, null, this.tools);

			trigger[0].lastRun = new Date();
			trigger[0].usersSent = trigger[0].usersSent + 1; 

			await milestonesTriggersRepo$.update(trigger[0]);
		}
	}

	private _assignRecipientID(message: TemplateMessage, endUserId: string, platform: PlatformType) {
		if(platform == PlatformType.WhatsApp) {
			message.endUserPhoneNumber = endUserId.split('_')[2];
		} else if (platform == PlatformType.Messenger) {
			message.receipientId = endUserId.split('_')[2];
		}

		return message;
	}
}
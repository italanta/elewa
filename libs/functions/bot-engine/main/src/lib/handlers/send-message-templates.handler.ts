import { WhatsappActiveChannel } from '@app/functions/bot-engine/whatsapp';
import { CommunicationChannel, Cursor } from '@app/model/convs-mgr/conversations/admin/system';
import { HandlerTools } from '@iote/cqrs';
import { __DateFromStorage } from '@iote/time';

import { FunctionHandler, RestResult, HttpsContext, RestResult200 } from '@ngfi/functions';
import { BlockDataService } from '../services/data-services/blocks.service';
import { ChannelDataService } from '../services/data-services/channel-info.service';
import { CursorDataService } from '../services/data-services/cursor.service';
import { EndUserDataService } from '../services/data-services/end-user.service';

export class SendReminderMessages extends FunctionHandler<{n: number}, RestResult | any>
{
  orgId: string = 'yXyu2Rn5FJbwfZVAl6w6agHNW4I2';
  public async execute(req: {n: number}, context: HttpsContext, tools: HandlerTools) 
  {
    try {
      // Get communication channel

      const channelDataService = new ChannelDataService(tools)

      const communicationChannel = await channelDataService.getChannelByConnection(req.n);

      if(!communicationChannel){ 
        return { error: 'Channel not found', status: 500} as RestResult
      }

      const whatsappActiveChannel = new WhatsappActiveChannel(tools, communicationChannel as CommunicationChannel);

      // Go though user documents and collect the latest cursor
      const endUserService = new EndUserDataService(tools, this.orgId);

      const cursorDataService = new CursorDataService(tools);

      const blockDataService = new BlockDataService(null, null, tools);

      const allEndUsers =  await endUserService.getDocuments(`orgs/${this.orgId}/end-users`);

      let count = 0;
      const milestoneData = allEndUsers.map(async (user) => {
      const userCreatedTime = __DateFromStorage(user.createdOn).unix() * 1000;

        if((Date.now() - userCreatedTime) > 86400000) {
          const docPath = `orgs/${this.orgId}/end-users/${user.id}/variables`;

          const valuesRepo$ = tools.getRepository<any>(docPath);
          // Name of the user
          const variableValues  =  await valuesRepo$.getDocumentById('values');
  
          const name = variableValues ? variableValues.name || "No name" : 'No name';
  
          const latestCursor = await cursorDataService.getLatestCursor(user.id, this.orgId) as Cursor;
  
          const storyId = latestCursor.position.storyId
  
          const story = await tools.getRepository<any>(`orgs/${this.orgId}/stories`).getDocumentById(storyId);
  
          const currentChapter = story.name ? story.name : 'No story name';
  
          let outgoingMessage;
  
          if(currentChapter.includes('1a') || currentChapter.includes('1b') || currentChapter.includes('1c'))
          {
            outgoingMessage = whatsappActiveChannel.parseOutTemplateMessage(templatesNames[0], user.phoneNumber);
            await whatsappActiveChannel.send(outgoingMessage);
  
            const lastBlock = await blockDataService.getBlockById(latestCursor.position.blockId, this.orgId, storyId);
  
            const lastMessage = whatsappActiveChannel.parseOutMessage(lastBlock, user.phoneNumber);
  
            await whatsappActiveChannel.send(lastMessage as any);
  
          } else if(currentChapter.includes('2a') || currentChapter.includes('2b') || currentChapter.includes('2c')) {
  
            outgoingMessage = whatsappActiveChannel.parseOutTemplateMessage(templatesNames[1], user.phoneNumber);
  
            await whatsappActiveChannel.send(outgoingMessage);
                      const lastBlock = await blockDataService.getBlockById(latestCursor.position.blockId, this.orgId, storyId);
  
            const lastMessage = whatsappActiveChannel.parseOutMessage(lastBlock, user.phoneNumber);
  
            await whatsappActiveChannel.send(lastMessage as any);
  
          } else if (currentChapter.includes('3a') || currentChapter.includes('3b') || currentChapter.includes('3c')) {
  
            outgoingMessage = whatsappActiveChannel.parseOutTemplateMessage(templatesNames[2], user.phoneNumber);
  
            await whatsappActiveChannel.send(outgoingMessage);
                      const lastBlock = await blockDataService.getBlockById(latestCursor.position.blockId, this.orgId, storyId);
  
            const lastMessage = whatsappActiveChannel.parseOutMessage(lastBlock, user.phoneNumber);
  
            await whatsappActiveChannel.send(lastMessage as any);
  
          } else if (currentChapter.includes('4a') || currentChapter.includes('4b') || currentChapter.includes('4c')) {
  
            outgoingMessage = whatsappActiveChannel.parseOutTemplateMessage(templatesNames[3], user.phoneNumber);
  
            await whatsappActiveChannel.send(outgoingMessage);
                      const lastBlock = await blockDataService.getBlockById(latestCursor.position.blockId, this.orgId, storyId);
  
            const lastMessage = whatsappActiveChannel.parseOutMessage(lastBlock, user.phoneNumber);
  
            await whatsappActiveChannel.send(lastMessage as any);
          }
  
          return { date: new Date().toDateString(), name, currentChapter, phoneNumber: user.phoneNumber };
        }

        count = count + 1;

        tools.Logger.log(() => `[MilestonesTrackerHandler].execute - Sent message to ${user.phoneNumber}`);
      });

      tools.Logger.log(() => `[MilestonesTrackerHandler].execute - Sent messages to ${count} users`);

      const data = await Promise.all(milestoneData);

      return data
    } catch (error) {
      tools.Logger.error(() => `[MilestonesTrackerHandler].execute - Encountered an error ${error}`);

      return { error: error.message, status: 500} as RestResult
    }
  }
}


const templatesNames = [
  "enabel_elearning_1a_1c",
  "enabel_elearning_2a_2c",
  "enabel_elearning_3a_3c",
  "enabel_elearning_4a_4c"
]

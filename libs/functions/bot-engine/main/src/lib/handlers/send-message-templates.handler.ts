import { WhatsappActiveChannel } from '@app/functions/bot-engine/whatsapp';
import { CommunicationChannel, Cursor } from '@app/model/convs-mgr/conversations/admin/system';
import { ChatStatus, EndUser } from '@app/model/convs-mgr/conversations/chats';
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
      // const allEndUsers: EndUser[] =  [{
      //   id: 'w_1_254710969595',
      //   phoneNumber: '254710969595',
      //   status: ChatStatus.Running,
      // }]

      let count = 0;
      let numbersSent = [];
      const milestoneData = allEndUsers.map(async (user) => {
      // const userCreatedTime = __DateFromStorage(user.createdOn).unix() * 1000;

        if(this.isAllowed(user.phoneNumber)) {
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
  
          if(currentChapter.includes('Introduction au systeme de sante') && (currentChapter.includes('1a') || currentChapter.includes('1b') || currentChapter.includes('1c')))
          {
            outgoingMessage = whatsappActiveChannel.parseOutTemplateMessage(templatesNames[0], user.phoneNumber);
            await whatsappActiveChannel.send(outgoingMessage);
  
            const lastBlock = await blockDataService.getBlockById(latestCursor.position.blockId, this.orgId, storyId);
  
            const lastMessage = whatsappActiveChannel.parseOutMessage(lastBlock, user.phoneNumber);
  
            await whatsappActiveChannel.send(lastMessage as any);
  
          } else if(currentChapter.includes('Introduction au systeme de sante') && (currentChapter.includes('2a') || currentChapter.includes('2b') || currentChapter.includes('2c'))) {
  
            outgoingMessage = whatsappActiveChannel.parseOutTemplateMessage(templatesNames[1], user.phoneNumber);
  
            await whatsappActiveChannel.send(outgoingMessage);
                      const lastBlock = await blockDataService.getBlockById(latestCursor.position.blockId, this.orgId, storyId);
  
            const lastMessage = whatsappActiveChannel.parseOutMessage(lastBlock, user.phoneNumber);
  
            await whatsappActiveChannel.send(lastMessage as any);
  
          } else if(currentChapter.includes('Introduction au systeme de sante') && (currentChapter.includes('3a') || currentChapter.includes('3b') || currentChapter.includes('3c'))) {
  
            outgoingMessage = whatsappActiveChannel.parseOutTemplateMessage(templatesNames[2], user.phoneNumber);
  
            await whatsappActiveChannel.send(outgoingMessage);
                      const lastBlock = await blockDataService.getBlockById(latestCursor.position.blockId, this.orgId, storyId);
  
            const lastMessage = whatsappActiveChannel.parseOutMessage(lastBlock, user.phoneNumber);
  
            await whatsappActiveChannel.send(lastMessage as any);
  
          } else if(currentChapter.includes('Introduction au systeme de sante') && (currentChapter.includes('4a') || currentChapter.includes('4b') || currentChapter.includes('4c'))) {
  
            outgoingMessage = whatsappActiveChannel.parseOutTemplateMessage(templatesNames[3], user.phoneNumber);
  
            await whatsappActiveChannel.send(outgoingMessage);
                      const lastBlock = await blockDataService.getBlockById(latestCursor.position.blockId, this.orgId, storyId);
  
            const lastMessage = whatsappActiveChannel.parseOutMessage(lastBlock, user.phoneNumber);
  
            await whatsappActiveChannel.send(lastMessage as any);
          } else if(currentChapter.includes('Indicators') && (currentChapter.includes('1a') || currentChapter.includes('1b') || currentChapter.includes('1c'))){
            outgoingMessage = whatsappActiveChannel.parseOutTemplateMessage(templatesNames[4], user.phoneNumber);
  
            await whatsappActiveChannel.send(outgoingMessage);
                      const lastBlock = await blockDataService.getBlockById(latestCursor.position.blockId, this.orgId, storyId);
  
            const lastMessage = whatsappActiveChannel.parseOutMessage(lastBlock, user.phoneNumber);
  
            await whatsappActiveChannel.send(lastMessage as any);

          } else if(currentChapter.includes('Indicators') && (currentChapter.includes('2a') || currentChapter.includes('2b') || currentChapter.includes('2c'))){
            outgoingMessage = whatsappActiveChannel.parseOutTemplateMessage(templatesNames[5], user.phoneNumber);
  
            await whatsappActiveChannel.send(outgoingMessage);
                      const lastBlock = await blockDataService.getBlockById(latestCursor.position.blockId, this.orgId, storyId);
  
            const lastMessage = whatsappActiveChannel.parseOutMessage(lastBlock, user.phoneNumber);
  
            await whatsappActiveChannel.send(lastMessage as any);
          } else if(currentChapter.includes('Therapeutic guides') && (currentChapter.includes('1a') || currentChapter.includes('1b') || currentChapter.includes('1c') ||  currentChapter.includes('1d'))){
            outgoingMessage = whatsappActiveChannel.parseOutTemplateMessage(templatesNames[6], user.phoneNumber);
  
            await whatsappActiveChannel.send(outgoingMessage);
                      const lastBlock = await blockDataService.getBlockById(latestCursor.position.blockId, this.orgId, storyId);
  
            const lastMessage = whatsappActiveChannel.parseOutMessage(lastBlock, user.phoneNumber);
  
            await whatsappActiveChannel.send(lastMessage as any);
          } else if(currentChapter.includes('Therapeutic guides') && (currentChapter.includes('2a') || currentChapter.includes('2b') || currentChapter.includes('2c'))){
            outgoingMessage = whatsappActiveChannel.parseOutTemplateMessage(templatesNames[7], user.phoneNumber);
  
            await whatsappActiveChannel.send(outgoingMessage);
                      const lastBlock = await blockDataService.getBlockById(latestCursor.position.blockId, this.orgId, storyId);
  
            const lastMessage = whatsappActiveChannel.parseOutMessage(lastBlock, user.phoneNumber);
  
            await whatsappActiveChannel.send(lastMessage as any);
          } else if(currentChapter.includes('Therapeutic guides') && (currentChapter.includes('3a') || currentChapter.includes('3b') || currentChapter.includes('3c'))){
            outgoingMessage = whatsappActiveChannel.parseOutTemplateMessage(templatesNames[8], user.phoneNumber);
  
            await whatsappActiveChannel.send(outgoingMessage);
                      const lastBlock = await blockDataService.getBlockById(latestCursor.position.blockId, this.orgId, storyId);
  
            const lastMessage = whatsappActiveChannel.parseOutMessage(lastBlock, user.phoneNumber);
  
            await whatsappActiveChannel.send(lastMessage as any);
          } else if(currentChapter.includes('Therapeutic guides') && (currentChapter.includes('4a') || currentChapter.includes('4b') || currentChapter.includes('4c'))){
            outgoingMessage = whatsappActiveChannel.parseOutTemplateMessage(templatesNames[9], user.phoneNumber);
  
            await whatsappActiveChannel.send(outgoingMessage);
                      const lastBlock = await blockDataService.getBlockById(latestCursor.position.blockId, this.orgId, storyId);
  
            const lastMessage = whatsappActiveChannel.parseOutMessage(lastBlock, user.phoneNumber);
  
            await whatsappActiveChannel.send(lastMessage as any);
          } else if(currentChapter.includes('Maternal & Child Health') && (currentChapter.includes('1a') || currentChapter.includes('1b') || currentChapter.includes('1c'))){
            outgoingMessage = whatsappActiveChannel.parseOutTemplateMessage(templatesNames[10], user.phoneNumber);
  
            await whatsappActiveChannel.send(outgoingMessage);
                      const lastBlock = await blockDataService.getBlockById(latestCursor.position.blockId, this.orgId, storyId);
  
            const lastMessage = whatsappActiveChannel.parseOutMessage(lastBlock, user.phoneNumber);
  
            await whatsappActiveChannel.send(lastMessage as any);
          } else if(currentChapter.includes('Statistics') && (currentChapter.includes('1a') || currentChapter.includes('1b') || currentChapter.includes('1c'))){
            outgoingMessage = whatsappActiveChannel.parseOutTemplateMessage(templatesNames[11], user.phoneNumber);
  
            await whatsappActiveChannel.send(outgoingMessage);
                      const lastBlock = await blockDataService.getBlockById(latestCursor.position.blockId, this.orgId, storyId);
  
            const lastMessage = whatsappActiveChannel.parseOutMessage(lastBlock, user.phoneNumber);
  
            await whatsappActiveChannel.send(lastMessage as any);
          }
  
          return { date: new Date().toDateString(), name, currentChapter, phoneNumber: user.phoneNumber };
        }

        count = count + 1;

        numbersSent.push(user.phoneNumber);
        tools.Logger.log(() => `[MilestonesTrackerHandler].execute - Sent message to ${user.phoneNumber}`);
      });

      tools.Logger.log(() => `[MilestonesTrackerHandler].execute - Sent messages to ${count} users`);
      tools.Logger.log(() => `[MilestonesTrackerHandler].execute - Sent messages to: ${numbersSent}`);
      const data = await Promise.all(milestoneData);

      return data
    } catch (error) {
      tools.Logger.error(() => `[MilestonesTrackerHandler].execute - Encountered an error ${error}`);

      return { error: error.message, status: 500} as RestResult
    }
  }

  private isAllowed(phoneNumber: string) {
    const omittedNumbers =[
      "254795225348",
      "32460957901",
      "32472175906",
      "32472539514",
      "32479385504",
      "32479385504",
      "33753061358",
      "254710113242",
      "254719728131",
      "254723219984",
      "254723219984",
      "254727429076",
      "254795225348",
      "254798698156"
    ]

    if(omittedNumbers.includes(phoneNumber)) {
      return false
    }

    return true;
  }
}



const templatesNames = [
  "enabel_elearning_1a_1c",
  "enabel_elearning_2a_2c",
  "enabel_elearning_3a_3c",
  "enabel_elearning_4a_4c",
  "enabel_national_indicators_1a_1c",
  "enabel_national_indicators_2a_2c",
  "enabel_therapeutic_guides_1a_1d", 
  "enabel_therapeutic_guides_2a_2c", 
  "enabel_therapeutic_guides_3a_3c", 
  "enabel_therapeutic_guides_4a_4c",
  "enabel_maternal_child_health_1a_1c", 
  "enabel_statistics_1a_1c ", 
]

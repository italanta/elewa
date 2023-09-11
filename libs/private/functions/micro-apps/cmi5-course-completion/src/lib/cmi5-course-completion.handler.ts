import { BlockDataService, ChannelDataService, ConnectionsDataService, CursorDataService, MessagesDataService } from "@app/functions/bot-engine";
import { ActiveChannelFactory } from "@app/functions/bot-engine/utils";
import { CommunicationChannel, Cursor } from "@app/model/convs-mgr/conversations/admin/system";
import { ChatStatus, EndUser } from "@app/model/convs-mgr/conversations/chats";
import { HandlerTools } from "@iote/cqrs";
import { FunctionContext, FunctionHandler, RestResult, RestResult200 } from "@ngfi/functions";
import { BotEngineJump } from '@app/functions/bot-engine';
import { BotMediaProcessService } from '@app/functions/bot-engine';
import { ProcessMessageService } from '@app/functions/bot-engine';






// Define the CMICourseCompletionHandler class
export class CMICourseCompletionHandler extends FunctionHandler<{ orgId: string, endUserId: string, result: string }, RestResult> {
  
  // Execute method to handle the main functionality
  public async execute(req: { orgId: string, endUserId: string }, context: FunctionContext, tools: HandlerTools) {
    
    try {
      // Split the endUserId to extract relevant information
      const splitEndUserId = req.endUserId.split('_');
      const n = parseInt(splitEndUserId[1]);
      const phoneNumber = splitEndUserId[2];
     
      // Create an instance of the ChannelDataService to retrieve communication channel information
      const _channelService$ = new ChannelDataService(tools);
  
      // Get the communication channel information based on the connection number (n)
      const communicationChannel: CommunicationChannel = await _channelService$.getChannelByConnection(n) as CommunicationChannel;
  
      // Update the orgId in the request with the organization ID from the communication channel
      req.orgId = communicationChannel.orgId;
  
      // Create instances of necessary data services and tools
      const connDataService = new ConnectionsDataService(communicationChannel, tools);
      const blockDataService = new BlockDataService(communicationChannel, connDataService, tools);
      const cursorDataService = new CursorDataService(tools);
      const msgDataService = new MessagesDataService(tools);
      const processMediaService = new BotMediaProcessService(tools);

      // Define the endUser object with relevant user information
      const endUser: EndUser = {
        id: req.endUserId,
        phoneNumber,
        status: ChatStatus.Running
      }
     
      // Retrieve the currentCursor based on the endUserId and orgId
      const currentCursor = await cursorDataService.getLatestCursor(req.endUserId, req.orgId);

      // Get the storyId and blockId from the currentCursor
      const storyIdAndBlockId = await cursorDataService.getStoryIdAndBlockId(req.endUserId, req.orgId);

      // Log the currentCursor information
      tools.Logger.log(() => `[CMICourseCompletionHandler].execute: Current Cursor: ${JSON.stringify(currentCursor)}`);

      // Create an instance of ActiveChannelFactory to get the active communication channel
      const activeChannelFactory = new ActiveChannelFactory();
  
      const activeChannel = activeChannelFactory.getActiveChannel(communicationChannel, tools);
      
      // Create an instance of ProcessMessageService to process messages
      const processMessageService = new ProcessMessageService(cursorDataService, connDataService, blockDataService, tools, activeChannel, processMediaService);
  
      // Create an instance of BotEngineJump to handle bot jumping logic
      const bot = new BotEngineJump(processMessageService, cursorDataService, msgDataService, processMediaService, activeChannel, tools);

      // Access the story ID and block ID from the current cursor
      const storyId = storyIdAndBlockId.position.storyId;
      const blockId = storyIdAndBlockId.position.blockId;

      // Perform bot jump to the specified story and block
      await bot.jump(storyId, req.orgId, endUser, currentCursor as Cursor, blockId);

      // Return a success response
      return { success: true } as RestResult200;
     
    } catch (error) {
      // Handle errors and log them
      tools.Logger.log(() => `[CMICourseCompletionHandler].execute: Error: ${error}`);
      return { status: 500 } as RestResult;
    }
  }  
}
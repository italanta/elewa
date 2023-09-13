import { HandlerTools } from "@iote/cqrs";
import { FunctionContext, FunctionHandler, RestResult, RestResult200 } from "@ngfi/functions";

import { BlockDataService, ChannelDataService, ConnectionsDataService, CursorDataService, MessagesDataService, ProcessMessageService, BotMediaProcessService, BotEngineJump } from "@app/functions/bot-engine";
import { ActiveChannelFactory } from "@app/functions/bot-engine/utils";
import { CommunicationChannel, Cursor } from "@app/model/convs-mgr/conversations/admin/system";
import { ChatStatus, EndUser } from "@app/model/convs-mgr/conversations/chats";

// Define the CMICourseCompletionHandler class
export class CourseCompleteHandler extends FunctionHandler<{ orgId: string, endUserId: string, result?: string }, RestResult> {
  private orgId: string;
  private endUserId: string;
  
  // Execute method to handle the main functionality
  public async execute(req: { orgId: string, endUserId: string, result?: string }, context: FunctionContext, tools: HandlerTools) {
    try {

      // Store orgId and endUserId as private properties
      this.orgId = req.orgId;
      this.endUserId = req.endUserId;

      // Split the endUserId to extract relevant information
      const splitEndUserId = this.endUserId.split('_');
      const n = parseInt(splitEndUserId[1]);
      const phoneNumber = splitEndUserId[2];
     
      // Create an instance of the ChannelDataService to retrieve communication channel information
      const _channelService$ = new ChannelDataService(tools);
  
      // Get the communication channel information based on the connection number (n)
      const communicationChannel: CommunicationChannel = await _channelService$.getChannelByConnection(n) as CommunicationChannel;
  
      // Create instances of necessary data services and tools
      const connDataService = new ConnectionsDataService(communicationChannel, tools);
      const blockDataService = new BlockDataService(communicationChannel, connDataService, tools);
      const cursorDataService = new CursorDataService(tools);
      const msgDataService = new MessagesDataService(tools);
      const processMediaService = new BotMediaProcessService(tools);

      // Define the endUser object with relevant user information
      const endUser: EndUser = {
        id: this.endUserId,
        phoneNumber,
        status: ChatStatus.Running
      }
     
      // Retrieve the currentCursor based on the endUserId and orgId
      const currentCursor = await cursorDataService.getLatestCursor(this.endUserId, this.orgId);

      if (!currentCursor) {
        // Handle the case where currentCursor is not found (return an error)
        return { status: 500 } as RestResult;
      }

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
        const cursorPosition = (currentCursor as Cursor).position || { storyId: '', blockId: '' };
        const storyId = cursorPosition.storyId || '';
        const blockId = cursorPosition.blockId || '';

    
       //check if the result exists
       const result = req.result
        if(!result){
          return { status: 500 } as RestResult;
        }
         // Define the path variable based on the result
        const sourceId = result === "success" ? `i-0-${blockId}` : `i-1-${blockId}`; 

        // Call the getConnBySourceId method to get the connection information
        const connection = await connDataService.getConnBySourceId(sourceId, this.orgId, storyId);
        
        if (!connection) {
          return { status: 500 } as RestResult;
        }
          // If a connection is found, you can use it as needed
          const targetId = connection.targetId;
  
          // Perform further actions with sourceId and targetId
          await bot.jump(storyId, this.orgId, endUser, currentCursor as Cursor, targetId);
        
     
      // Return a success response
      return { success: true } as RestResult200;
      
    } catch (error) {
      // Handle errors and log them
      tools.Logger.log(() => `[CMICourseCompletionHandler].execute: Error: ${error}`);
      return { status: 500 } as RestResult;
    }
  }  
}
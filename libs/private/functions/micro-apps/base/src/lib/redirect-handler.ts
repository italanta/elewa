import { HandlerTools } from '@iote/cqrs';
import { Query } from '@ngfi/firestore-qbuilder';
import { FunctionHandler, FunctionContext, RestResult } from '@ngfi/functions';

import { CommunicationChannel, Cursor } from '@app/model/convs-mgr/conversations/admin/system';
import { InitMicroAppCmd, MicroAppSectionTypes, MicroAppStatus, MicroAppStatusTypes } from '@app/model/convs-mgr/micro-app/base';
import { ChatStatus, EndUser } from '@app/model/convs-mgr/conversations/chats';
import { ActiveChannelFactory } from '@app/functions/bot-engine/utils';
import { EngineBotManager } from '@app/functions/bot-engine';
import { Message, TextMessage } from '@app/model/convs-mgr/conversations/messages';
import { MessageTypes } from '@app/model/convs-mgr/functions';

/**
 * Moves the user to the next block and sends data to the callback url provided
 * 
 * Next block -> Uses the bot engine manager to move to the next block,
 *  which means the logic should be done on the bot engine side e.g. nextBlock factory,
 *    and will depend on the type and configuration of the micro-app
 */
export class MicroAppRedirectHandler extends FunctionHandler<InitMicroAppCmd, RestResult>
{
  private responseMessage: string;

  public async execute(req: InitMicroAppCmd, context: FunctionContext, tools: HandlerTools): Promise<RestResult>
  {

    try {
      const cursorRepo$ = tools.getRepository<Cursor>(`orgs/${req.orgId}/end-users/${req.endUserId}/cursor`);
      const endUserRepo$ = tools.getRepository<EndUser>(`orgs/${req.orgId}/end-users`);
      const channelRepo$ = tools.getRepository<CommunicationChannel>(`channels`);
      const idArr = req.endUserId.split('_');

      const n = parseInt(idArr[1]);

      const channels = await channelRepo$.getDocuments(new Query().where('n','==',n));

      if (!channels || channels.length == 0) {
        this.responseMessage = 'Channel does not exist';
        throw this.responseMessage;
      }

      const channel = channels[0];

      const activeChannel = new ActiveChannelFactory().getActiveChannel(channel, tools);

      const endUser = await endUserRepo$.getDocumentById(req.endUserId);

      if (!endUser) {
        this.responseMessage = `User does not exist :: ${req.endUserId}`;
        throw this.responseMessage;
      }

      const engine = new EngineBotManager(tools,tools.Logger, activeChannel);

      // Get latest cursor
      const result = await cursorRepo$.getDocuments(new Query().orderBy('createdOn', 'desc').limit(1));

      if (!result || result.length == 0) {
        this.responseMessage = 'User cursor empty';
        throw this.responseMessage;
      }

      const latestCursor = result[0];

      if (!latestCursor.microappStack || latestCursor.microappStack.length === 0) {
        this.responseMessage = `Micro app '${req.appId}' not initialized for user: ${req.endUserId}`;
        throw this.responseMessage;
      }

      // Find and update the current micro-app status
      const microappStack = latestCursor.microappStack;

      const currentMicroAppArr = microappStack.filter((status) => status.appId == req.appId);
      let currentStatus: MicroAppStatus;

      if (!currentMicroAppArr || currentMicroAppArr.length == 0) {
        this.responseMessage = `Micro app '${req.appId}' not initialized for user: ${req.endUserId}`;
        throw this.responseMessage;
      }


      if (currentMicroAppArr.length > 1) {
        const sortedMicroAppStatuses = currentMicroAppArr.sort((a, b) => b.timestamp - a.timestamp);
        currentStatus = sortedMicroAppStatuses[0];
      } else {
        currentStatus = currentMicroAppArr[0];
      }

      // Resume the bot -> change status to running
      endUser.status = ChatStatus.Running;

      await endUserRepo$.update(endUser);

      // TODO: Get callback url from the status and post the micro-app data... 

      const newStatus: MicroAppStatus = {
        ...currentStatus,
      };

      const timestamp = Date.now();

      if (currentStatus.status !== MicroAppStatusTypes.Started) {
        this.responseMessage = `Invalid micro app status for redirect :: ${currentStatus.status}`
        throw this.responseMessage;
      }

      newStatus.currentSection = MicroAppSectionTypes.Redirect;
      newStatus.status = MicroAppStatusTypes.Completed;
      newStatus.timestamp = timestamp;

      latestCursor.microappStack.unshift(newStatus);

      await cursorRepo$.create(latestCursor, timestamp.toString());

      // Run the bot engine to send the next message
      return engine.run(null, endUser);

    } catch (error) {

      tools.Logger.error(() => `[MicroAppRedirectHandler].execute - Encountered error :: ${JSON.stringify(error)}`);
      
      return {
        status: 500,
        message: JSON.stringify(error)
      } as RestResult;
    }
  }
}



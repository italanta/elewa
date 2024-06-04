import { HandlerTools } from '@iote/cqrs';
import { Query } from '@ngfi/firestore-qbuilder';
import { FunctionHandler, FunctionContext } from '@ngfi/functions';

import { Cursor } from '@app/model/convs-mgr/conversations/admin/system';
import { InitMicroAppCmd, InitMicroAppResponse, MicroAppSectionTypes, MicroAppStatus, MicroAppStatusTypes } from '@app/model/convs-mgr/micro-app/base';

export class InitMicroAppHandler extends FunctionHandler<InitMicroAppCmd, InitMicroAppResponse>
{
  private responseMessage: string;

  public async execute(req: InitMicroAppCmd, context: FunctionContext, tools: HandlerTools): Promise<InitMicroAppResponse>
  {

    try {
      const cursorRepo$ = tools.getRepository<Cursor>(`orgs/${req.orgId}/end-users/${req.endUserId}/cursor`);

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

      const newStatus: MicroAppStatus = {
        ...currentStatus,
      };

      const timestamp = Date.now();

      if (currentStatus.status === MicroAppStatusTypes.Initialized) {
        newStatus.currentSection = MicroAppSectionTypes.Start;
        newStatus.status = MicroAppStatusTypes.Launched;
        newStatus.timestamp = timestamp;
      } else {
        tools.Logger.log(() => `[InitMicroAppHandler].execute - Micro app already initialized. Returning the current user position`);
        // Incase the status is already initialized, then we resume the users progress
        newStatus.currentSection = MicroAppSectionTypes.Main;
        newStatus.timestamp = timestamp;
      }

      latestCursor.microappStack.unshift(newStatus);

      await cursorRepo$.create(latestCursor, timestamp.toString());

      return {
        success: true,
        message: `Micro app '${req.appId}' initialized for user: ${req.endUserId}`,
        status: newStatus
      };

    } catch (error) {

      tools.Logger.error(() => `[InitMicroAppHandler].execute - Encountered error :: ${JSON.stringify(error)}`);
      return {
        success: false,
        message: JSON.stringify(error)
      };
    }
  }

}



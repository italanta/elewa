import { HandlerTools } from '@iote/cqrs';

import { FunctionHandler, RestResult } from '@ngfi/functions';

import { EngineBotManager } from '@app/functions/bot-engine';

import { Message } from '@app/model/convs-mgr/conversations/messages';
import { CommunicationChannel } from '@app/model/convs-mgr/conversations/admin/system';
import { PreviewActiveChannel } from './services/preview-active-channel';
import { EndUser } from '@app/model/convs-mgr/conversations/chats';

export class PreviewChannelReceiveHandler extends FunctionHandler<{ message: Message, channel: CommunicationChannel; }, RestResult>
{
  public async execute(req: { message: Message, channel: CommunicationChannel; }, context: any, tools: HandlerTools) 
  {
    try {
      const previewActiveChannel = new PreviewActiveChannel(tools, req.channel);

      const engine = new EngineBotManager(tools, tools.Logger, previewActiveChannel);
      engine.setPreviewMode(true);

      const endUser = {
        id: req.channel.id,
      } as EndUser;

      return engine.run(req.message, endUser);
    } catch (error) {
      tools.Logger.error(() => `[PreviewChannelReceiveHandler].execute - Error:: ${error}`);
      return { status: 500, message: error } as RestResult;
    }
  }
}

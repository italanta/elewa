import { HandlerTools } from '@iote/cqrs';

import { FunctionHandler, RestResult200 } from '@ngfi/functions';

import { EngineBotManager } from '@app/functions/bot-engine';

import { Message } from '@app/model/convs-mgr/conversations/messages';
import { CommunicationChannel } from '@app/model/convs-mgr/conversations/admin/system';

export class PreviewChannelReceiveHandler extends FunctionHandler<{message: Message, channel: CommunicationChannel}, RestResult200>
{
  public async execute(req: {message: Message, channel: CommunicationChannel}, context: any, tools: HandlerTools) 
  {
    
    const engine = new EngineBotManager(tools, tools.Logger, null);
    engine.setPreviewMode(true);
    
    try {
      
      return {};
    } catch (error) {
      
      return {};
    }
  }
}

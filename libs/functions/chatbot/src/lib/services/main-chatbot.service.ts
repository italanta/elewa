import * as fetch from 'node-fetch';
import { Logger } from '@iote/cqrs';

import { config } from '../environment/environment';

/**
 * Integrates with the Landbot API to exchange information back and forth.
 */
export class ChatBotService
{
  constructor(private _logger: Logger) { }

   /**
   * Pause bot and assign a user to an agent.
   *
   * @param chatId  - Chat to assign to operator
   * 
   * */
  pauseBot(chatId: string)
  {
    throw new Error("Not yet implemented");
  }

   /**
   * Send a message to a user over a channel.
   *
   * @param chatId  - Chat to send message through
   * @param message - Message to send
   * */
  sendMessage(chatId: string, message: string)
  {
    throw new Error("Not yet implemented");
  }

  setOnline()
  {
    throw new Error("Not yet implemented");
  }

  assignToAgent(customer_id: string)
  {
    throw new Error("Not yet implemented");
  }

  ifOnline()
  {
    throw new Error("Not yet implemented");
  }


   /**
   * Resume chat
   *
   * @param chatId   - Chat to send message through
   * @param botId  - Bot to redirect the user to
   * @param blockRef - Block Reference within chat
   */
  resumeChat(chatId: string, botId: number, blockRef?: string)
  {
    throw new Error("Not yet implemented");
  }


  registerMessagehook(channelId: string, ref: string, name: string, cbUrl?: string)
  {
    throw new Error("Not yet implemented");
  }

  // Perform a call to Landbot
  private async _callLandbot(res: string, body: any, method: string = 'post') : Promise<any>
  {
    throw new Error("Not yet implemented");
  }

}

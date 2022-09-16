import * as fetch from 'node-fetch';
import { Logger } from '@iote/cqrs';

import { config } from '../environment/environment';

/**
 * Integrates with the Landbot API to exchange information back and forth.
 */
export class LandbotService
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
    // @see https://api.landbot.io/#api-Customers-PutHttpsApiLandbotIoV1CustomersCustomer_idAssign
    const settings = {} as any;

    return this._callLandbot(`customers/${chatId}/assign/`, settings, 'put');
  }

   /**
   * Send a message to a user over a channel.
   *
   * @param chatId  - Chat to send message through
   * @param message - Message to send
   * */
  sendMessage(chatId: string, message: string)
  {
    // @see https://api.landbot.io/#api-Customers-PostHttpsApiLandbotIoV1CustomersCustomer_idSend_text
    const settings = { "message": message };

    return this._callLandbot(`customers/${chatId}/send_text/`, settings);
  }

  setOnline()
  {
    // @see https://api.landbot.io/#api-Agents-PutHttpsApiLandbotIoV1Agents
    const settings = { "status": "online" };

    return this._callLandbot(`agents/`, settings, 'put');
  }

  assignToAgent(customer_id: string)
  {
    // @see https://api.landbot.io/#api-Agents-PutHttpsApiLandbotIoV1Agents
    const settings = {};

    return this._callLandbot(`customers/${customer_id}/assign/`, settings, 'put');
  }

  ifOnline()
  {
    const AGENT_ID = 129133;
    // @see https://api.landbot.io/#api-Agents-PutHttpsApiLandbotIoV1Agents
    const settings = { "status": "online" };

    return this._callLandbot(`agents/${AGENT_ID}/`, settings);
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
    // @see https://api.landbot.io/#api-Customers-PutHttpsApiLandbotIoV1CustomersCustomer_idAssign_botBot_id
    const settings = { launch: true } as any;
    if(blockRef)
      settings.node = blockRef;

    return this._callLandbot(`customers/${chatId}/assign_bot/${botId}/`, settings, 'put');
  }

  /**
   * Admin feature
   *  - Registers a MessageHook for a certain Landbot Channel. @see https://help.landbot.io/article/n9zxrqx1ig-message-hooks-landbot-webhooks
   *  - MessageHooks set a callback URI on the side of Landbot, instructing landbot to call a callback URI we determine whenever a chat comes in on that channel.
   *  - Limit: 10 calls / second - Determined by LandBot's throughput capacity.
   *
   * @param channelId - ChannelID to listen to
   * @param ref       - The reference code to link an incoming chat to a determined channel
   * @param name      - Name of the Channel
   * @param cbUrl     - Callback URL LandBot should call whenever a message comes in on the channelId. Uses Pipedream by default.
   * */
  registerMessagehook(channelId: string, ref: string, name: string, cbUrl?: string)
  {
    // @see https://api.landbot.io/#api-MessageHooks-PostHttpsApiLandbotIoV1ChannelsChannel_idMessage_hooks
    const settings = { "url": cbUrl != null? cbUrl : CALLBACK_MANAGER_URL,
                       "token": ref,
                       "name": name };

    return this._callLandbot(`channels/${channelId}/message_hooks/`, settings);
  }

  // Perform a call to Landbot
  private async _callLandbot(res: string, body: any, method: string = 'post') : Promise<any>
  {
    this._logger.log(() => `Creating call to Landbot for resource ${res} with params ${JSON.stringify(body)}`);

    const data = {
      method: method,
      uri: LANDBOT_BASE_URL + res,
      headers: this._getHeaders(),

      body: JSON.stringify(body)
    };

    const response = await fetch.default(data.uri, data);

    const responseJson= await response.json();

    this._logger.log(() => `Response from Landbot: ${JSON.stringify(responseJson)}`);

    return responseJson;
  }

  /**
   * Generates Headers and adds Authorisation parameters
   * @see: https://api.landbot.io/#api-General
   */
  private _getHeaders()
  {
    return new fetch.Headers({
      "Authorization": `Token ${LANDBOT_API_KEY}`,
      "Content-Type": "application/json"
    });
  }

}

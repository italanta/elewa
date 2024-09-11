import axios from 'axios';

import { WFlow } from "@app/model/convs-mgr/stories/flows";
import { HandlerTools } from '@iote/cqrs';
import { FunctionContext, FunctionHandler } from '@ngfi/functions';
import { WhatsAppCommunicationChannel } from '@app/model/convs-mgr/conversations/admin/system';
import { Query } from '@ngfi/firestore-qbuilder';


const GRAPH_API = process.env['GRAPH_API'];
const API_VERSION: string = process.env['MESSENGER_VERSION'] || 'v18.0';

/** 
 * @see https://developers.facebook.com/docs/whatsapp/flows/reference/flowsapi/
 */
export class CreateWhatsappFlowHandler extends FunctionHandler<{flow: WFlow, orgId: string}, any> {
  async execute(data: {flow: WFlow, orgId: string}, context: FunctionContext, tools: HandlerTools): Promise<any> 
  {
    try {
      const channel = await this._getChannel(data.orgId, tools);
      tools.Logger.log(()=> `🟤 This is the channel: ${channel}`)

      if(!channel && channel.length < 1) {
        throw 'Channel does not exist for org: ' + data.orgId;
      }
      
      const whatsappChannel = channel[0];
  
      const WABA_ID = whatsappChannel.businessAccountId;
      const GRAPH_ACCESS_TOKEN = whatsappChannel.accessToken;
  
      const base_url= `${GRAPH_API}/${API_VERSION}/${WABA_ID}/flows`;
  
      const payload = this._prepareData(data.flow);
      tools.Logger.log(()=> `🟤 This is the payload: ${payload}`)
  
      // Update the flow ID
      const resp = await axios.post(base_url, payload, {
        headers: {
          'Content-Type': `application/json`,
          'Authorization': `Bearer ${GRAPH_ACCESS_TOKEN}`
        }
      })
  
      if(resp.data && resp.data.id) {
        const flowId = resp.data.id;
    
        return {flowId, success: true};
      } else {
        tools.Logger.error(()=> `Error when creating flow :: ${JSON.stringify(resp.data || "")}`)
        return {success: false};
      }
      
    } catch (error) {
      tools.Logger.error(()=> `Error when creating flow :: ${error}`)
      return {success: false};
    }
  }

  private _getChannel(orgId: string, tools: HandlerTools) {
    const channelRepo$ = tools.getRepository<WhatsAppCommunicationChannel>(`channels`);

    return channelRepo$.getDocuments(new Query().where("orgId", "==", orgId));
  }

  private _prepareData(flowConfig: WFlow){
    return {
      flow: flowConfig.flow,
      name: flowConfig.name,
      // endpoint_uri: flowConfig.endpoint_uri
    };
  }
}

import axios from 'axios';

import { WFlow } from "@app/model/convs-mgr/stories/flows";
import { HandlerTools } from '@iote/cqrs';
import { FunctionContext, FunctionHandler } from '@ngfi/functions/v2';


const GRAPH_API = process.env['graphAPI'];
const API_VERSION: string = process.env['MESSENGER_VERSION'] || 'v18.0';
const GRAPH_ACCESS_TOKEN = process.env['graphAccessToken'];
const WABA_ID = process.env['wabaId'];

export class CreateWhatsappFlowHandler extends FunctionHandler<any, any> {
  public override execute(data: WFlow, context: FunctionContext, tools: HandlerTools): Promise<WFlow> 
  {
    const base_url= `${GRAPH_API}/${API_VERSION}/${WABA_ID}/flows`;

    const formData = this._prepareData(data);
    // Update the flow ID
    return axios.post(base_url, formData, {
      headers: {
        'Content-Type': `multipart/form-data`,
        'Authorization': `Bearer ${GRAPH_ACCESS_TOKEN}`
      }
    })
  }

  private _prepareData(data: WFlow){
    const formData = new FormData();
    formData.append('flow', JSON.stringify(data.flow));
    formData.append('name', data.name as string);
    formData.append('preview', JSON.stringify(data.preview));
    formData.append('endpoint_uri', data.endpoint_uri as string);
    formData.append('clone_flow_id', data.clone_flow_id as string);
    return formData;
  }
}

import axios from 'axios';
import { WFlow } from "@app/model/convs-mgr/stories/flows";
import { HandlerTools } from '@iote/cqrs';
import { FunctionContext, FunctionHandler } from '@ngfi/functions';


const GRAPH_API = process.env['graphAPI'];
const API_VERSION: string = process.env['MESSENGER_VERSION'] || 'v18.0';
const GRAPH_ACCESS_TOKEN = process.env['graphAccessToken'];
const WABA_ID = process.env['wabaId'];

export class UpdateWhatsappFlowHandler extends FunctionHandler<any, any> {
  public override execute(data: WFlow, context: FunctionContext, tools: HandlerTools): Promise<WFlow> 
  {
    const base_url= `${GRAPH_API}/${API_VERSION}/${WABA_ID}/flows/${data.id}`;   

    const formData = this._prepareData(data);

    return axios.post(base_url, formData, {
      headers: {
        'Content-Type': `multipart/form-data`,
        'Authorization': `Bearer ${GRAPH_ACCESS_TOKEN}`
      }
    })
  }

  private _prepareData(data: WFlow): FormData{
    const formData = new FormData();
    if(data.flow){
        formData.append('flow', JSON.stringify(data.flow));
    }
    if(data.name){
        formData.append('name', data.name as string);
    }
    if(data.preview){
        formData.append('preview', JSON.stringify(data.preview));
    }
    if(data.endpoint_uri){
        formData.append('endpoint_uri', data.endpoint_uri as string);
    }
    if(data.clone_flow_id){
        formData.append('clone_flow_id', data.clone_flow_id as string);
    }
    return formData;
  }
}

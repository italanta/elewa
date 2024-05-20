import { SessionsClient } from "@google-cloud/dialogflow-cx";
import { DialogflowCXIntent } from "libs/functions/intent/src/lib/models/dialogflow-cx-Intent.model";

export class IntentBlockService 
{
  private _client: SessionsClient = new SessionsClient();
  agentPath: string;
  constructor(intentEnv?: {
    projectId: string,
    location: string,
    agentId: string
  }){
    this._client.agentPath(process.env.projectId, process.env.location, process.env.agentId);
  }
  async detectIntent(message: string, userId: string): Promise<any>{
    const request = { 
      session: this._client.projectLocationAgentSessionPath(process.env.projectId, process.env.location, process.env.agentId, userId),
      queryInput:{ text: 
        { 
          text: message  
        }
      }
    };
 
    const [ response ] = await this._client.detectIntent(request);
    const intentResponse = response.queryResult;
    return new Promise((resolve, reject) => {
      resolve(intentResponse);
    });
  }
}
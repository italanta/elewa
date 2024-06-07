import  { IntentsClient } from "@google-cloud/dialogflow-cx";

import { HandlerTools } from "@iote/cqrs";
import { IObject } from "@iote/bricks";
import { Query } from "@ngfi/firestore-qbuilder";

import { DialogflowCXIntent, TrainingPhrase } from '@app/model/convs-mgr/fallbacks';

export class IntentService {
  private _client: IntentsClient = new IntentsClient();
  agentPath: string;
  constructor(intentEnv?: {
    projectId: string,
    location: string,
    agentId: string
  
  }){
    this._client.agentPath(process.env.projectId, process.env.location, process.env.agentId);
  }

  async createIntent(intent: DialogflowCXIntent, tools: HandlerTools): Promise<DialogflowCXIntent> {
    const intentRepo = tools.getRepository<DialogflowCXIntent>(`orgs/${intent.orgId}/fallbacks`);
    const createdIntent = {
      displayName: intent.actionDetails.description,
      trainingPhrases: [],
      messages: [],
    };
    const dialogFlowIntent = {intent: createdIntent}

    const dialogFlowIntentCreate = await this._client.createIntent(dialogFlowIntent);
    intent.id = dialogFlowIntentCreate[0].name;
    intent.name = dialogFlowIntentCreate[0].name;

    return intentRepo.create(intent);
  }

  getIntent(intent: DialogflowCXIntent): Promise<any>{
    const intentInfo = {
        name: intent.name
    }
    const intentResponse = this._client.getIntent(intentInfo);
    return new Promise((resolve, reject) => {
      resolve(intentResponse);
    });
  }

  async getModuleIntents(orgId: string, botId: string, handlerTools: HandlerTools): Promise<DialogflowCXIntent[]>{
    const moduleRepo = await handlerTools.getRepository(`orgs/${orgId}/fallbacks`);
    const moduleIntents = await moduleRepo.getDocuments(new Query()) as DialogflowCXIntent[];
    return moduleIntents;
  }

  updateIntent(intent: DialogflowCXIntent, tools: HandlerTools): Promise<DialogflowCXIntent> {
    const intentRepo = tools.getRepository(`orgs/${intent.orgId}/fallbacks`);
    
    const phrases = intent.userInput.map((input)=> {
      return {text: input}
    });

    const updatedIntent = {
      name: intent.name,
      trainingPhrases: [{
        parts: phrases
      }]
    };
    
    this._client.updateIntent({
      intent: updatedIntent
    });
    
    const intentWrite = intentRepo.write(intent, intent.id);

    return new Promise((resolve, reject) => {
      resolve(intentWrite as unknown as DialogflowCXIntent);
    });
  }

  async deleteIntent(intent: DialogflowCXIntent): Promise<string>{
    const deleteIntent = {
      name: intent.name
    }
    this._client.deleteIntent(deleteIntent);
    return new Promise((resolve, reject) => {
      resolve('Intent deleted successfully');
    });
  }

}
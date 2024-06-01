import  { IntentsClient } from "@google-cloud/dialogflow-cx";

import { HandlerTools } from "@iote/cqrs";
import { IObject } from "@iote/bricks";
import { Query } from "@ngfi/firestore-qbuilder";

import { DialogflowCXIntent } from '@app/model/convs-mgr/fallbacks';

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

  createIntent(intent: DialogflowCXIntent, tools: HandlerTools): Promise<DialogflowCXIntent> {
    const intentRepo = tools.getRepository(`orgs/${intent.orgId}/modules/${intent.botId}/intents`);
    const createdIntent = {
      displayName: intent.displayName,
      trainingPhrases: [],
      messages: [],
    };
    const dialogFlowIntent = {intent: createdIntent}

    const dialogFlowIntentCreate =this._client.createIntent(dialogFlowIntent);
    const intentRepoCreate = intentRepo.create(intent);

    return Promise.all([dialogFlowIntentCreate, intentRepoCreate]);
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
    const moduleRepo = await handlerTools.getRepository(`orgs/${orgId}/modules/${moduleId}/intents`);
    const moduleIntents = await moduleRepo.getDocuments(new Query()) as DialogflowCXIntent[];
    return moduleIntents;
  }

  updateIntent(intent: DialogflowCXIntent, tools: HandlerTools): Promise<DialogflowCXIntent> {
    const intentRepo = tools.getRepository(`orgs/${intent.orgId}/modules/${intent.botId}/intents`);
    const updatedIntent = {
      name: intent.name,
      trainingPhrases: intent.trainingPhrases,
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
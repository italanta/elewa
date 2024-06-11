import  { IntentsClient } from "@google-cloud/dialogflow-cx";

import { PagesClient } from '@google-cloud/dialogflow-cx';

import { HandlerTools } from "@iote/cqrs";
import { Query } from "@ngfi/firestore-qbuilder";

import { DialogflowCXIntent } from '@app/model/convs-mgr/fallbacks';

export class IntentService {
  apiEndpoint = `${process.env.LOCATION}-dialogflow.googleapis.com`;
  private _client: IntentsClient = new IntentsClient({apiEndpoint: this.apiEndpoint});
  private _pagesClient: PagesClient = new PagesClient({apiEndpoint: this.apiEndpoint});
  agentPath: string;
  constructor(){
   this.agentPath = this._client.agentPath(process.env.PROJECT_ID, process.env.LOCATION, process.env.AGENT_ID);
  }

  async createIntent(intent: DialogflowCXIntent, tools: HandlerTools): Promise<DialogflowCXIntent> {
    const intentRepo = tools.getRepository<DialogflowCXIntent>(`orgs/${intent.orgId}/fallbacks`);
    const createdIntent = {
      displayName: intent.actionDetails.description,
      trainingPhrases: [],
      messages: [],
    };
    
    const dialogFlowIntent = {intent: createdIntent};
    
    dialogFlowIntent['parent'] = this.agentPath;

    const dialogFlowIntentCreate = await this._client.createIntent(dialogFlowIntent);
    const id = dialogFlowIntentCreate[0].name.split("/").join("_");
    intent.id = id;
    intent.name = dialogFlowIntentCreate[0].name;

    return intentRepo.create(intent, intent.id);
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

  async updateIntent(intent: DialogflowCXIntent, tools: HandlerTools): Promise<DialogflowCXIntent> {
    const intentRepo = tools.getRepository<DialogflowCXIntent>(`orgs/${intent.orgId}/fallbacks`);
    // Id to the default Goomza flow & page. Should be created manually on dialogflow.cloud.google.com
    const flowId = process.env.FLOW_ID;
    const pageId = process.env.PAGE_ID;

    const flowPath = this._pagesClient.flowPath(process.env.PROJECT_ID, process.env.LOCATION, process.env.AGENT_ID, flowId);
    const pagePath = this._pagesClient.pagePath(process.env.PROJECT_ID, process.env.LOCATION, process.env.AGENT_ID, flowId, pageId);

    const getPageRequest = {
      name: pagePath
    };
    
    const phrases = intent.userInput.map((input)=> {
      return {parts: [{text: input}], repeatCount: 2};
    });

    const updatedIntent = {
      displayName: intent.actionDetails.description,
      name: intent.name,
      trainingPhrases: phrases
    };
    
    await this._client.updateIntent({
      intent: updatedIntent
    });



    const [page] = await this._pagesClient.getPage(getPageRequest);
    const transitions = page.transitionRoutes || [];

    const newTransition = {
      name: `transition_${updatedIntent.name}`,
      intent: updatedIntent.name,
      targetPage: pagePath,
      targetFlow: flowPath
    };

    transitions.push(newTransition);

    const updatePageRequest = {
      name: page.name,
      page: {
        ...page,
        transitionRoutes: transitions,
      },
    };

    await this._pagesClient.updatePage(updatePageRequest);
    
    intent.trainingPhrases = updatedIntent.trainingPhrases;

    return intentRepo.update(intent);
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
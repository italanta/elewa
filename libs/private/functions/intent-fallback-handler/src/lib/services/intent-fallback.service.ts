import { BotModule } from '@app/model/convs-mgr/bot-modules';
import { PagesClient, SessionsClient } from '@google-cloud/dialogflow-cx';
import { GoogleGenerativeAI } from '@google/generative-ai';

import { HandlerTools } from '@iote/cqrs';

import { Organisation } from '@app/model/organisation';

import { ValidateAndSanitize } from '../../utils/validate-and-sanitize.util';

const LOW_CONFIDENCE_THRESHOLD = process.env.LOW_CONFIDENCE_THRESHOLD || 0.5;

export class IntentFallbackService {
  apiEndpoint = `${process.env.LOCATION}-dialogflow.googleapis.com`;

  private _pagesClient: PagesClient = new PagesClient({apiEndpoint: this.apiEndpoint});
  
  geminiAPIKey:string;
  handlerTools: HandlerTools;
  private botId: string;
  private module: BotModule;
  private org: Organisation;
  private agentID: string;

  private _pageID: string;
  private _flowID: string;

  constructor(){
    this.geminiAPIKey = process.env.GEMINI_API_KEY;
  }

  async init(orgId: string, moduleId: string, tools: HandlerTools) {
    const modulesRepo = tools.getRepository<BotModule>(`orgs/${orgId}/modules`);
    this.module = await modulesRepo.getDocumentById(moduleId);
    this.botId = this.module.parentBot;

    const orgsRepo$ = tools.getRepository<Organisation>(`orgs`);

    this.org = await orgsRepo$.getDocumentById(orgId);

    this.agentID = this._getID(this.module.agent);
    this._pageID = this._getID(this.module.page);
    this._flowID = this._getID(this.module.flow);
  }

  private _getID(name: string) {
    const nameArr = name.split('/');
    return nameArr[nameArr.length -1];
  }

  async detectIntentAndRespond(userStatement: string, intents: string[], endUserId: string) {
    console.log("[IntentFallbackService] - Detecting intent for statement:", userStatement);

    const dialogflowClient = new SessionsClient({apiEndpoint: this.apiEndpoint});
    
    const sessionPath = dialogflowClient.projectLocationAgentSessionPath(process.env.GCLOUD_PROJECT, process.env.LOCATION, this.agentID, endUserId);
    const pagePath = this._pagesClient.pagePath(process.env.GCLOUD_PROJECT, process.env.LOCATION, this.agentID,this._flowID, this._pageID);
    
    try {
      const request = {
        session: sessionPath,
        queryParams: {
          currentPage: pagePath
        },
        queryInput: {
          text: {
            text: userStatement,
          },
          // TODO: Should be passed from front end
          languageCode: 'en-US',
        },
      };
      const [dialogflowResponse] = await dialogflowClient.detectIntent(request);

      const detectedIntent = dialogflowResponse.queryResult.intent;
      
      console.log(`Detection Response :: ${JSON.stringify(dialogflowResponse)}`);

      const confidence = dialogflowResponse.queryResult.intentDetectionConfidence;
      const THRESHOLD = parseInt(LOW_CONFIDENCE_THRESHOLD as string);

      console.log('Confidence ::', confidence);

      if (!detectedIntent || confidence < THRESHOLD) {
        return null;
        // TODO: Design a fallback strategy for Gemini
        // return this._geminiFallback(userStatement, intents);
      } else {
        console.log('Using Dialogflow CX response with high confidence:', confidence);
        // Craft your response to the user based on Dialogflow's intent
        return detectedIntent;
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }

  async _geminiFallback(userStatement: string, intents: string[]){
    // Use the Gemini API to generate a response
        const modelId = "gemini-pro";
        const geminiClient = new GoogleGenerativeAI(this.geminiAPIKey);
        const model = geminiClient.getGenerativeModel({model: modelId});

        const currentMessages = [
          {
            role: 'user',
            parts: [
              {
                text: `You are an intent detection service \n Respond with the following structure: \n '[intentOutput]'`
              }
            ]
          }
        ];
        const message = `\n what is the intent of the following statement -- ${userStatement} -- based on this list of intents -- \n ${intents.join(', ')} -- \n ?`
        const chat = await model.startChat({
          history: currentMessages,
          generationConfig: {
            maxOutputTokens:50
          }
        })
        const geminiQuery = await chat.sendMessage(message);
        const response = await geminiQuery.response;
        const responseText = await response.text();
        return intents.findIndex(intentValue => intentValue.includes(`${responseText}`));
  }
}
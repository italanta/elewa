import { SessionsClient } from '@google-cloud/dialogflow-cx';
import { GoogleGenerativeAI } from '@google/generative-ai';

import { HandlerTools } from '@iote/cqrs';

const LOW_CONFIDENCE_THRESHOLD = process.env.LOW_CONFIDENCE_THRESHOLD || 0.5;

export class IntentFallbackService {
  apiEndpoint = `${process.env.LOCATION}-dialogflow.googleapis.com`;
  
  geminiAPIKey:string;
  handlerTools: HandlerTools;
  constructor(){
    this.geminiAPIKey = process.env.GEMINI_API_KEY;
  }

  async detectIntentAndRespond(userStatement: string, intents: string[], endUserId: string) {
    console.log("[IntentFallbackService] - Detecting intent for statement:", userStatement);

    const dialogflowClient = new SessionsClient({apiEndpoint: this.apiEndpoint});
    
    const sessionPath = dialogflowClient.projectLocationAgentSessionPath(process.env.GCLOUD_PROJECT, process.env.LOCATION, process.env.AGENT_ID, endUserId);
  
    try {
      const request = {
        session: sessionPath,
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
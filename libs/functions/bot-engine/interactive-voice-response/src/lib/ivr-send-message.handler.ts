// import { HandlerTools } from '@iote/cqrs';
// import { FunctionHandler, RestResult, HttpsContext, RestResult200 } from '@ngfi/functions';
// import { ChannelDataService, generateEndUserId, MessagesDataService } from '@app/functions/bot-engine';
// import { MessageDirection, OutgoingMessagePayload } from '@app/model/convs-mgr/conversations/messages';
// import * as sdk from "microsoft-cognitiveservices-speech-sdk";
// import AfricasTalking from 'africastalking';
// import { IVRActiveChannel } from './models/ivr-active-channel.interface';
// import { IVROutgoingMessage } from './models/ivr-incoming-message.interface';
// import { textToSpeech } from './services/azure-text-to-speech.service';
// import { parseOutgoingMessage } from './utils/ivr-message-parser';
// import { AzureStorageConfig } from './models/azure-storage-config.interface';
// import { generateIVRXml } from './utils/generate-xml.utility';
// import { PlatformType } from '@app/model/convs-mgr/conversations/admin/system';





// // Handler class to manage outgoing IVR messages
// export class IVRSendOutgoingMsgHandler extends FunctionHandler<any, RestResult> {
//   private readonly AFRICASTALKING_CALLBACK_URL = '';

//   private speechConfig: sdk.SpeechConfig;   // Azure Speech SDK config.
//   private africasTalking: any;              // Africa's Talking SDK.

//   constructor() {
//     super();
//     // Initialize Azure Speech SDK config using environment variables.
//     this.speechConfig = sdk.SpeechConfig.fromSubscription(
//         process.env.AZURE_SPEECH_KEY, 
//         process.env.AZURE_SPEECH_REGION
//     );
//     const config: AzureStorageConfig = {
//         connectionString: "",
//         containerName: "audio-files"
//     };
//   }

//   /**
//    * Main handler function to process and send outgoing IVR messages.
//    * 
//    * 1. Verifies message direction.
//    * 2. Retrieves the IVR channel information.
//    * 3. Uses Azure TTS to convert the message text to speech.
//    * 4. Sends the voice call using Africa's Talking.
//    * 
//    * @param {any} incomingPayload - Payload containing the message and user details.
//    * @param {HttpsContext} context - HTTP context of the request.
//    * @param {HandlerTools} tools - Tools like logger and database helpers.
//    * @returns {Promise<RestResult>} The result of the operation, typically a 200 or 500 status.
//    */
//   public async execute(incomingPayload: IVRAPICallback, context: HttpsContext, tools: HandlerTools): Promise<RestResult> {
//     try {

//       tools.Logger.log(() => `[IVRSendOutgoingMsgHandler] - Incoming payload: ${JSON.stringify(incomingPayload)}`);

//       // Step 2: Get channel information.
//       const n = 78;
//       const endUserPhoneNumber = incomingPayload.callerNumber.replace('+', '');
//       const endUserId = generateEndUserId(endUserPhoneNumber, PlatformType.WhatsApp, n);

//       // STEP 4: Get the latest message from the conversation
//       const msgService = new MessagesDataService(tools);
      
//       // Step 3: Create an active IVR channel and send the message.
//       const ivrActiveChannel: IVRActiveChannel = {
//         handleIncoming: async (payload: IVRAPICallback) => {
//           const { isActive, callerNumber, dtmfDigits } = payload;
//           if (!isActive) return 'hangup';  // If call is no longer active, end the session.
          
//           // Step 4: Process incoming digits and generate the next message.
//           const nextMessage = await this.getNextMessage(callerNumber, dtmfDigits);
//           const audioContent = await textToSpeech(this.speechConfig, nextMessage.text, nextMessage.voiceGender);

//           // Convert audio to Base64 and return it in AfricasTalking XML response format.
//           const audioBase64 = Buffer.from(audioContent).toString('base64');

//           return generateIVRXml(audioBase64, this.AFRICASTALKING_CALLBACK_URL);
//         }
//       };

//       // Step 5: Parse the outgoing message and convert it to speech.
//       const outgoingMessagePayload = parseOutgoingMessage(incomingPayload);
//       const audioContent = await textToSpeech(this.speechConfig, outgoingMessagePayload.message, outgoingMessagePayload.voiceGender);

//       // Step 6: Initiate the call.
//       await ivrActiveChannel.send(outgoingMessagePayload);

//       return { success: true } as RestResult200;
//     } catch (error) {
//       tools.Logger.error(() => `[IVRSendOutgoingMsgHandler].execute - Encountered an error: ${error}`);
//       return { status: 500, error: 'Internal Server Error' } as RestResult;
//     }
//   }

//   /**
//    * Determines the next message to send in the IVR flow based on user input (DTMF digits).
//    * 
//    * @param {string} callerNumber - The phone number of the caller.
//    * @param {string} dtmfDigits - The DTMF digits entered by the caller.
//    * @returns {Promise<{ text: string, voiceGender: 'male' | 'female' }>} The next message and voice type.
//    */
//   private async getNextMessage(callerNumber: string, dtmfDigits: string): Promise<{ text: string, voiceGender: 'male' | 'female' }> {
//     // This function can be extended to query a database for the next step based on the conversation state.
//     return {
//       text: `You pressed ${dtmfDigits}. This is the next step in your IVR flow.`,
//       voiceGender: 'female'  // Example message, can be modified based on the flow.
//     };
//   }
// }
// // const config: AzureStorageConfig = {
// //   connectionString: "",
// //   containerName: "audio-files"
// // };
// // const audioUploadService = new AzureAudioUploadService(config);
// // await audioUploadService.initializeContainer();
// // const audioBuffer = /* Azure TTS */;
// // const uploadedUrl = await audioUploadService.uploadAudio(audioBuffer);
// // console.log("Uploaded audio URL:", uploadedUrl);
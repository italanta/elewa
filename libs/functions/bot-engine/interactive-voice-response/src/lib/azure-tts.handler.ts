import * as sdk from "microsoft-cognitiveservices-speech-sdk";
import { FunctionHandler, RestResult, HttpsContext } from '@ngfi/functions';
import { HandlerTools } from '@iote/cqrs';
import { TextToSpeechService } from "./services/azure-text-to-speech.service";
import { TextToSpeechPayload } from './models/text-to-speech-payload.interface';

export class ConvertTextToSpeechHandler extends FunctionHandler<any, RestResult> {
  /**
   * Converts text to speech using Azure's Text-to-Speech service and returns the audio data.
   * 
   * @param payload<TextToSpeechPayload> - The request payload, which should contain `text` and `voiceGender`.
   * @param context - The HTTPS context, which contains information about the request.
   * @param tools - The handler tools for logging and other utilities.
   * 
   * @returns A REST result with the generated audio data or an error message.
   */
  public async execute(payload: TextToSpeechPayload, context: HttpsContext, tools: HandlerTools): Promise<RestResult> {
    // Initialize the test to speech service
    const ttsService = new TextToSpeechService();

    // Extract the voice gender and the text from the payload
    const { text, voiceGender } = payload;

    // Validate payload
    if (!text || !voiceGender) {
      return { status: 400, message: "Invalid input. Text and voiceGender are required." } as RestResult;
    }

    // Create SpeechConfig using Azure Speech SDK
    const speechConfig = sdk.SpeechConfig.fromSubscription(
      process.env['AZURE_SPEECH_KEY']!,  // Azure Speech Service API Key from environment
      process.env['AZURE_SPEECH_REGION']! // Azure region for the speech service
    );

    try {
      // Use TextToSpeechService to convert text to speech
      const audioData = await this.ttsService.convertTextToSpeech(speechConfig, text, voiceGender);

      tools.Logger.log(() => `Text-to-speech conversion successful for text: "${text}"`);

      // Return the audio data as part of the response
      return { status: 200, data: audioData } as RestResult;

    } catch (error: any) {
      tools.Logger.error(() => `Text-to-speech conversion failed: ${error.message}`);
      return { status: 500, message: `Failed to convert text to speech: ${error.message}` } as RestResult;
    }
  }
}

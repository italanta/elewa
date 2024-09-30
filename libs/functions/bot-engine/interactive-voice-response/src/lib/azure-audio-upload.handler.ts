import { FunctionContext, FunctionHandler } from '@ngfi/functions';
import { HandlerTools } from '@iote/cqrs';
import { ContainerClient } from '@azure/storage-blob';
import { AzureAudioUploadService } from './services/azure-blob-upload.service';

/**
 * Handler class for uploading audio to Azure Blob Storage.
 * This handler is designed to be executed as part of a serverless function
 * and interacts with Azure Blob Storage using the AzureAudioUploadService.
 */
export class UploadAudioHandler extends FunctionHandler<any, void> {

  /**
   * Executes the handler to upload audio to Azure Blob Storage.
   * @param {{ audioBuffer: ArrayBuffer, storyId: string, blockId: string, voiceGender: 'male' | 'female' }} audioData - The audio data to upload.
   * @param {FunctionContext} context - The function execution context, including authentication and metadata.
   * @param {HandlerTools} tools - Utility tools including logging and repositories for additional actions.
   * @returns {Promise<void>} - No return value. Throws an error if the upload fails.
   */
  public async execute(audioData: { audioBuffer: ArrayBuffer, storyId: string, blockId: string, voiceGender: 'male' | 'female' }, context: FunctionContext, tools: HandlerTools): Promise<void> {
    tools = tools;
    tools.Logger.debug(() => `Beginning Execution, Uploading Audio`);

    await this.uploadAudioToAzure(audioData, tools);
  }

  /**
   * Uploads the audio to Azure Blob Storage using the provided AzureAudioUploadService.
   * @param {{ audioBuffer: ArrayBuffer, storyId: string, blockId: string, voiceGender: 'male' | 'female' }} audioData - The audio data and metadata for upload.
   * @returns {Promise<void>} - No return value. Logs the result or throws an error.
   * @throws {Error} - Throws an error if the audio upload fails.
   */
  private async uploadAudioToAzure(audioData: { audioBuffer: ArrayBuffer, storyId: string, blockId: string, voiceGender: 'male' | 'female' }, tools: HandlerTools): Promise<void> {
    const { audioBuffer, storyId, blockId, voiceGender } = audioData;
    const audioUploadService = new AzureAudioUploadService();
    
    try {
      // Initialize Azure Blob Storage client
      const azureStorageConnectionString = process.env.AZURE_STORAGE_CONNECTION_STRING; 
      const containerName = process.env.AZURE_STORAGE_MEDIA_URL;
      
      const containerClient = new ContainerClient(azureStorageConnectionString, containerName);

      tools.Logger.debug(() => `Uploading audio file for storyId: ${storyId}, blockId: ${blockId}, voice: ${voiceGender}`);

      const audioUrl = await audioUploadService.uploadAudio(containerClient, audioBuffer, storyId, blockId, voiceGender);

      tools.Logger.log(() => `Audio file uploaded successfully: ${audioUrl}`);
    } catch (error) {
      tools.Logger.error(() => `Failed to upload audio file: ${error}`);
      throw new Error(`Could not upload audio file: ${error}`);
    }
  }
}

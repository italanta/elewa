import { BlobServiceClient, BlockBlobClient, ContainerClient } from "@azure/storage-blob";

/**
 * Service for uploading audio files to Azure Blob Storage
*/
export class AzureAudioUploadService {
  
  constructor() 
  {
  }

  /**
   * Uploads an audio buffer to Azure Blob Storage with a structured path.
   * @param {ContainerClient} containerClient - Container client to be used
   * @param {ArrayBuffer} audioBuffer - The audio data as an ArrayBuffer
   * @param {string} storyId - The ID of the story
   * @param {string} blockId - The ID of the block
   * @param {'male' | 'female'} voiceGender - The gender of the voice (used to create folder structure)
   * @returns {Promise<string>} The URL of the uploaded blob
   * @throws {Error} If there's an issue with the upload process
   */
  async uploadAudio(containerClient: ContainerClient, audioBuffer: ArrayBuffer, storyId?: string, blockId?: string, voiceGender?: 'male' | 'female'): Promise<string> {
    try 
    {
      // Create a filename using storyId, voiceGender, and blockId
      const blobName = `${storyId}/${voiceGender}/${blockId}.mp3`;  // or `.wav` based on your format
      
      // Get a block blob client for the specified blob name
      await this.initializeContainer(containerClient);
      const blockBlobClient: BlockBlobClient = containerClient.getBlockBlobClient(blobName);
      
      // Upload the audio buffer to Azure Blob Storage
      await blockBlobClient.uploadData(audioBuffer, {
        blobHTTPHeaders: { blobContentType: "audio/mpeg" }
      });

      // Return the URL of the uploaded blob
      return blockBlobClient.url;
    } 
    catch (error) 
    {
      console.error("Error uploading audio to Azure Blob Storage:", error);
      throw new Error("Failed to upload audio to Azure Blob Storage");
    }
  }


  /**
   * Initializes the container if it doesn't exist.
   * This method should be called before using the service to ensure the container exists.
   */
  async initializeContainer(containerClient: ContainerClient): Promise<void> {
    try 
    {
      await containerClient.createIfNotExists();
    } 
    catch (error) 
    {
      console.error("Error initializing container:", error);
      throw new Error("Failed to initialize Azure Blob Storage container");
    }
  }

  /**
   * Deletes an audio file from Azure Blob Storage.
   * @param {ContainerClient} containerClient - The ContainerClient
   * @param {string} blobName - The name of the blob to delete
   * @returns {Promise<void>}
   * @throws {Error} If there's an issue with the deletion process
   */
  async deleteAudio(containerClient: ContainerClient, blobName: string): Promise<void> {
    try {
      const blockBlobClient: BlockBlobClient = containerClient.getBlockBlobClient(blobName);
      await blockBlobClient.delete();
      console.log(`Blob "${blobName}" deleted successfully.`);
    } catch (error) {
      console.error("Error deleting audio from Azure Blob Storage:", error);
      throw new Error("Failed to delete audio from Azure Blob Storage");
    }
  }
}
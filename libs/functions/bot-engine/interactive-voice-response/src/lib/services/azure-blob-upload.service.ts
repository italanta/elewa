import { BlobServiceClient, BlockBlobClient, ContainerClient } from "@azure/storage-blob";
import { v4 as uuidv4 } from 'uuid';
import { AzureStorageConfig } from "../models/azure-storage-config.interface";


/**
 * Service for uploading audio files to Azure Blob Storage
 */
export class AzureAudioUploadService {
  private containerClient: ContainerClient;

  /**
   * Creates an instance of AzureAudioUploadService.
   * @param {AzureStorageConfig} config - The configuration object for Azure Storage
   */
  constructor(private config: AzureStorageConfig) {
    const blobServiceClient = BlobServiceClient.fromConnectionString(this.config.connectionString);
    this.containerClient = blobServiceClient.getContainerClient(this.config.containerName);
  }

  /**
   * Uploads an audio buffer to Azure Blob Storage.
   * @param {ArrayBuffer} audioBuffer - The audio data as an ArrayBuffer
   * @param {string} [filename] - Optional filename. If not provided, a UUID will be generated
   * @returns {Promise<string>} The URL of the uploaded blob
   * @throws {Error} If there's an issue with the upload process
   */
  async uploadAudio(audioBuffer: ArrayBuffer, filename?: string): Promise<string> {
    try {
      // Generate a unique filename if not provided
      const blobName = filename || `${uuidv4()}.wav`;

      // Get a block blob client
      const blockBlobClient: BlockBlobClient = this.containerClient.getBlockBlobClient(blobName);

      // Upload the audio buffer
      await blockBlobClient.uploadData(audioBuffer, {
        blobHTTPHeaders: { blobContentType: "audio/wav" }
      });

      // Return the URL of the uploaded blob
      return blockBlobClient.url;
    } catch (error) {
      console.error("Error uploading audio to Azure Blob Storage:", error);
      throw new Error("Failed to upload audio to Azure Blob Storage");
    }
  }

  /**
   * Initializes the container if it doesn't exist.
   * This method should be called before using the service to ensure the container exists.
   */
  async initializeContainer(): Promise<void> {
    try {
      await this.containerClient.createIfNotExists();
      console.log(`Container "${this.config.containerName}" is ready.`);
    } catch (error) {
      console.error("Error initializing container:", error);
      throw new Error("Failed to initialize Azure Blob Storage container");
    }
  }

  /**
   * Deletes an audio file from Azure Blob Storage.
   * @param {string} blobName - The name of the blob to delete
   * @returns {Promise<void>}
   * @throws {Error} If there's an issue with the deletion process
   */
  async deleteAudio(blobName: string): Promise<void> {
    try {
      const blockBlobClient: BlockBlobClient = this.containerClient.getBlockBlobClient(blobName);
      await blockBlobClient.delete();
      console.log(`Blob "${blobName}" deleted successfully.`);
    } catch (error) {
      console.error("Error deleting audio from Azure Blob Storage:", error);
      throw new Error("Failed to delete audio from Azure Blob Storage");
    }
  }
}
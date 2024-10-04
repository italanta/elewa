import { Injectable } from '@angular/core';
import { Repository, DataService } from '@ngfi/angular';
import { DataStore } from '@ngfi/state';
import { of, Observable, forkJoin, throwError, from } from 'rxjs';
import { tap, switchMap } from 'rxjs/operators';
import * as sdk from "microsoft-cognitiveservices-speech-sdk";

import { Logger } from '@iote/bricks-angular';
import { StoryBlock, StoryBlockTypes } from '@app/model/convs-mgr/stories/blocks/main';

import { StoryEditorState } from '@app/state/convs-mgr/story-editor';
import { QuestionMessageBlock } from '@app/model/convs-mgr/stories/blocks/messaging';
import { AzureAudioUploadService, TextToSpeechService } from 'interactive-voice-response';
import { StoryBlocksStore } from '@app/state/convs-mgr/stories/blocks';
import { environment } from '@env/environment';
import { AzureStorageConfig } from 'libs/functions/bot-engine/interactive-voice-response/src/lib/models/azure-storage-config.interface';
import { BlobServiceClient, ContainerClient } from '@azure/storage-blob';
import { AngularFireFunctions } from '@angular/fire/compat/functions';

@Injectable()
export class IvrService {
  protected _activeRepo: Repository<StoryBlock>;
  private speechConfig: sdk.SpeechConfig; 
  private containerClient: ContainerClient;

  constructor
  (
    private _blocksStore: StoryBlocksStore,
    private _ttsService: TextToSpeechService,
    private _azureBlobService: AzureAudioUploadService,
    private _logger: Logger ,
    private _aff: AngularFireFunctions
  ) 
  {
    this.speechConfig = sdk.SpeechConfig.fromSubscription(
        process.env['AZURE_SPEECH_KEY']!, 
        process.env['AZURE_SPEECH_REGION']!
    );
    /**
     * Creates an instance of AzureAudioUploadService.
     * @param {AzureStorageConfig} config - The configuration object for Azure Storage
     */
    const config: AzureStorageConfig = {
      "connectionString" : process.env['AZURE_BLOB_CONNECTION_STRING']!,
      "containerName" : process.env['AZURE_BLOB_CONTAINER_NAME']!
    };
    const blobServiceClient = BlobServiceClient.fromConnectionString(config.connectionString);
    this.containerClient = blobServiceClient.getContainerClient(config.containerName);
  }

  /**
   * Save a story block, generate audio, and upload it to Azure Blob storage.
   * @param storyBlock - The story block to process (either a textMessage or questionBlock)
   * @returns Observable that emits the saved story block with the audio URL appended
   */
  save(storyBlock: StoryEditorState): Observable<StoryBlock[]> {
    const blockObservables = storyBlock.blocks.map((block: StoryBlock) =>
      this._generateAudioForBlock(block, storyBlock.story.id!).pipe(
        switchMap(audioBlob =>
          // Upload the generated audio using a Cloud Function (azureAudioUpload)
          this._scheduleAudioUpload(audioBlob, storyBlock.story.id!, block.id!, 'male')
        ),
        switchMap(audioUrl => {
          block.azureTtsAudioUrl = audioUrl;
          return this._blocksStore.update(block);
        }),
        tap(() => this._logger.log(() => `Block with audio saved: ${block}`))
      )
    );

    return forkJoin(blockObservables).pipe(
      tap(() => this._logger.log(() => 'All blocks for the story processed.')),
      switchMap(() => of(storyBlock.blocks))
    );
  }

  /**
   * Calls the cloud function 'azureTts' to convert text to speech.
   * @param data - The data containing the text and options.
   * @returns Observable<ArrayBuffer> - The generated audio data.
   */
  private _scheduleTtsCall(data: any): Observable<ArrayBuffer> {
    return this._aff.httpsCallable('azureTts')(data);
  }
  
  /**
   * Generates the audio for the provided block.
   * @param block - The Story block to be converted to audio.
   * @returns  Observable<Blob> - the url of the generated audio.
   */
  private _generateAudioForBlock(block: StoryBlock, storyId: string): Observable<ArrayBuffer> {
    const textToConvert = this._prepareTextForSpeech(block);
  
    if (!textToConvert) {
      return throwError(() => new Error('No valid text to convert for this block.'));
    }
  
    return this._scheduleTtsCall({
      text: textToConvert,
      voice: 'male',
      storyId: storyId,
      blockId: block.id
    });
  }
  
  /**
   * Prepares the text to be converted into speech based on the block type.
   * @param block - The story block containing the message or question.
   * @returns {string} The combined text of the message and options, or an empty string if invalid.
   */
  private _prepareTextForSpeech(block: StoryBlock): string {
    switch (block.type) {
      case StoryBlockTypes.TextMessage:
        return block.message || '';
  
      case StoryBlockTypes.QuestionBlock:
        return this._prepareQuestionBlockText(block);
  
      default:
        return ''; 
    }
  }
  
  /**
   * Prepares the text for a question block by combining the message and options.
   * @param block - The question block containing the message and options.
   * @returns {string} The concatenated message and options as a single string.
   */
  private _prepareQuestionBlockText(block: QuestionMessageBlock): string {
    if (!block.message) return '';
  
    // Concatenate the question message with its options (if available)
    const optionsText = block.options?.map(opt => opt.message).join(' ') || '';
    return `${block.message} ${optionsText}`.trim();
  }

  /**
   * Calls the cloud function 'azureAudioUpload' to upload audio to Azure Blob Storage.
   * @param audioBlob - The audio data to upload.
   * @param storyId - The ID of the story.
   * @param blockId - The ID of the block.
   * @param voice - The voice used (e.g., 'male').
   * @returns Observable<string> - The URL of the uploaded audio.
   */
  private _scheduleAudioUpload(audioBlob: ArrayBuffer, storyId: string, blockId: string, voice: string): Observable<string> {
    return this._aff.httpsCallable('azureAudioUpload')({
      audioBlob,
      storyId,
      blockId,
      voice
    });
  }
}

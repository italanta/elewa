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

@Injectable()
export class IvrService {
  protected _activeRepo: Repository<StoryBlock>;
  private speechConfig: sdk.SpeechConfig; 

  constructor(
    private _blocksStore: StoryBlocksStore,
    private _ttsService: TextToSpeechService,
    private _azureBlobService: AzureAudioUploadService,
    private _logger: Logger
  ) {
    this.speechConfig = sdk.SpeechConfig.fromSubscription(
        process.env.AZURE_SPEECH_KEY, 
        process.env.AZURE_SPEECH_REGION
    );
  }

  /**
   * Save a story block, generate audio, and upload it to Azure Blob storage.
   * @param storyBlock - The story block to process (either a textMessage or questionBlock)
   * @returns Observable that emits the saved story block with the audio URL appended
   */
  save(storyBlock: StoryEditorState): Observable<StoryBlock[]> {
    // Create an array of observables to handle each block's audio generation and upload
    const blockObservables = storyBlock.blocks.map((block: StoryBlock) =>
      this._generateAudioForBlock(block).pipe(
        switchMap(audioBlob =>
          // Upload audio to Azure Blob Storage and get the URL
          this._azureBlobService.uploadAudio(audioBlob, storyBlock.story.id, block.id, 'male')
        ),
        switchMap(audioUrl => {
          // Append audio URL to the current block
          block.azureTtsAudioUrl = audioUrl;
  
          // Save the updated block with the audio URL
          return this._blocksStore.update(block);
        }),
        tap(() => this._logger.log(() => `Block with audio saved: ${block}`))
      )
    );
  
    // Use forkJoin to wait for all observables (all blocks) to complete
    return forkJoin(blockObservables).pipe(
      tap(() => this._logger.log(() => 'All blocks for the story processed.')),
      // Return the updated story blocks
      switchMap(() => of(storyBlock.blocks))
    );
  }
  
  /**
   * Generates the audio for the provided block.
   * @param block - The Story block to be converted to audio.
   * @returns  Observable<Blob> - the url of the generated audio.
   */
  private _generateAudioForBlock(block: StoryBlock): Observable<ArrayBuffer> {
    const textToConvert = this._prepareTextForSpeech(block);
  
    if (!textToConvert) {
      return throwError(() => new Error('No valid text to convert for this block.'));
    }
  
    return from(this._ttsService.convertTextToSpeech(this.speechConfig, textToConvert, 'male'));
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
}

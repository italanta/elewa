import { Component, OnInit, Input, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { SubSink } from 'subsink';
import { take } from 'rxjs';
import { BrowserJsPlumbInstance } from '@jsplumb/browser-ui';
import WaveSurfer from 'wavesurfer.js';


import { FileStorageService } from '@app/state/file';
import { VoiceMessageBlock } from '@app/model/convs-mgr/stories/blocks/messaging';

@Component({
  selector: 'app-audio-block',
  templateUrl: './audio-block.component.html',
  styleUrls: ['./audio-block.component.scss'],
})
export class AudioBlockComponent implements OnInit, OnDestroy,AfterViewInit {
  @Input() id: string;
  @Input() block: VoiceMessageBlock;
  @Input() audioMessageForm: FormGroup;
  @Input() jsPlumb: BrowserJsPlumbInstance;
  @ViewChild('waveform') waveformElement!: ElementRef;


  private _sBs = new SubSink();
  private wavesurfer!: WaveSurfer;


  file: File;
  audioInputId: string;
  isLoadingAudio: boolean;
  byPassedLimits: any[] = [];
  whatsappLimit: boolean;
  messengerLimit: boolean;

  constructor(private _audioUploadService: FileStorageService) {}

  ngOnInit(): void {
    this.audioInputId = `aud-${this.id}`;
    const fileSize = this.audioMessageForm.get('fileSize')?.value

    if (fileSize) {
      this._checkSizeLimit(fileSize);
    }

    /** Call the method to initialize WaveSurfer*/
    

  }

  async processAudio(event: any) {
    this.file = event.target.files[0];

    if (this.file) {
      this.isLoadingAudio = true;

      //Step 1 - Create the file path that will be in firebase storage
      const audioFilePath = `audios/${this.file.name}_${new Date().getTime()}`;
      
      //Step 2 - Upload file to firestore
      const response = await this._audioUploadService.uploadSingleFile(this.file, audioFilePath);

      const fileSizeInKB = this.file.size / 1024;

      //Step 3 - PatchValue to Block
      this._sBs.sink = response.pipe(take(1)).subscribe((url) => this._autofillUrl(url, fileSizeInKB));
    }
  }

  
  /** Step 3 Check if file bypasses size limit. */
  private _checkSizeLimit(fileSize: number) {
    this.byPassedLimits = this._audioUploadService.checkFileSizeLimits(fileSize, 'audio');

    if (this.byPassedLimits.find(limit => limit.platform === "WhatsApp")) this.whatsappLimit = true;
    else if (this.byPassedLimits.find(limit => limit.platform === "messenger")) this.messengerLimit = true;
  };

  private _autofillUrl(url: string, fileSizeInKB: number) {
    this.audioMessageForm.patchValue({ fileSrc: url, fileSize: fileSizeInKB });
    this.isLoadingAudio = false;
    this._checkSizeLimit(fileSizeInKB);
  };

  /**Initializes a WaveSurfer instance for audio waveform visualization. */
  private initializeWaveSurfer(): void {
    this.wavesurfer = WaveSurfer.create({
      container: this.waveformElement.nativeElement,
      waveColor: '#E9E7F4',
      progressColor: '#1F7A8C',
      barWidth: 3,
      barHeight: 0.1,
      normalize: true,
    });
  }

 /**this function is responsible for setting up and initializing the WaveSurfer component*/
  ngAfterViewInit() {
    this.initializeWaveSurfer();   

  }
/*
  *Handles the selection of an audio file through an input event.
  *Retrieves the selected file, creates a URL for it, and loads it into the WaveSurfer instance.
  */
  handleFileInput(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const files = inputElement.files;
  
    if (files && files.length > 0) {
      const file = files[0];
      const url = URL.createObjectURL(file);
      console.log('Before loading file:', url);

      this.wavesurfer.load(url);
      console.log('After loading file');

    }
  }
/**Toggles the play and pause state of the Wavesurfer audio player. */
  togglePlayPause(): void {
    if (this.wavesurfer) {
      if (this.wavesurfer.isPlaying()) {
        this.wavesurfer.pause();
      } else {
        this.wavesurfer.play();
      }
    }
  }
  
  ngOnDestroy() {
    this._sBs.unsubscribe();
  }
}

import { Component, OnInit, Input, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

import WaveSurfer from 'wavesurfer.js';

import { SubSink } from 'subsink';
import { take } from 'rxjs';
import { BrowserJsPlumbInstance } from '@jsplumb/browser-ui';

import { ICONS_AND_TITLES } from '../../../../../main/src/lib/assets/icons-and-titles'

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

  svgIcon = ""


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

    /** Assign the SVG icon based on the 'block.type' to 'svgIcon'.*/
    this.svgIcon = this.getBlockIconAndTitle(this.block.type).svgIcon;
  }
  
  /**Get icon and title information based on 'type'. */
  getBlockIconAndTitle(type:number) {
    return ICONS_AND_TITLES[type];
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
      this._sBs.sink = response.pipe(take(1)).subscribe(async (url) =>{
        this.wavesurfer.load(url);
        this._autofillUrl(url, fileSizeInKB);
      });
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
      height: 30,
      normalize: true,
    });
  }

 /**setting up and initializing the WaveSurfer component.
*/
  ngAfterViewInit() {
    this.initializeWaveSurfer();
  
    if (this.block.fileSrc) {
      this.wavesurfer.load(this.block.fileSrc);
    }
  }

/**Toggles the play and pause state of the Wavesurfer audio player. */
  togglePlayPause(): void {
    if (!this.wavesurfer) return;

    if (this.wavesurfer.isPlaying()) {
      this.wavesurfer.pause();
    } else this.wavesurfer.play();
  }

  ngOnDestroy() {
    this._sBs.unsubscribe();
  }
}

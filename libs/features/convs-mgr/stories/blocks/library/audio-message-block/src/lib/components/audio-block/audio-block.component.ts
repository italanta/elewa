import { Component, OnInit, AfterViewInit, Input, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import WaveSurfer from 'wavesurfer.js'
import { SubSink } from 'subsink';
import { take } from 'rxjs';
import { BrowserJsPlumbInstance } from '@jsplumb/browser-ui';

import { FileStorageService } from '@app/state/file';
import { VoiceMessageBlock } from '@app/model/convs-mgr/stories/blocks/messaging';

@Component({
  selector: 'app-audio-block',
  templateUrl: './audio-block.component.html',
  styleUrls: ['./audio-block.component.scss'],
})
export class AudioBlockComponent implements OnInit, OnDestroy {
  @Input() id: string;
  @Input() block: VoiceMessageBlock;
  @Input() audioMessageForm: FormGroup;
  @Input() jsPlumb: BrowserJsPlumbInstance;
  @ViewChild('waveform') waveformElement: ElementRef;

  private _sBs = new SubSink();

  file: File;
  audioInputId: string;
  isLoadingAudio: boolean;
  byPassedLimits: any[] = [];
  whatsappLimit: boolean;
  messengerLimit: boolean;
  waversufer: any;

  constructor(private _audioUploadService: FileStorageService) {}

  ngOnInit(): void {
    this.audioInputId = `aud-${this.id}`;
    const fileSize = this.audioMessageForm.get('fileSize')?.value

    if (fileSize) {
      this._checkSizeLimit(fileSize);
    }
  }
  ngAfterViewInit(): void {

    this.waversufer = WaveSurfer.create({
      container: this.waveformElement.nativeElement,
      height: 20,
      waveColor: '#E9E7F4',
      progressColor: '#1F7A8C',
      url: '',
    })

      // Check if the audioMessageForm has a pre-existing fileSrc (URL)
      const existingUrl = this.audioMessageForm.get('fileSrc')?.value;

      if (existingUrl) {
        // If a URL already exists, load the waveform with that URL
        this.waversufer.load(existingUrl);
      }

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
      this._sBs.sink = response.pipe(take(1)).subscribe((url) => {
        // Set the URL to the WaveSurfer instance
        this.waversufer.load(url);
        // Autofill the form values
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

  ngOnDestroy() {
    this._sBs.unsubscribe();
  }
}

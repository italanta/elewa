import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { take } from 'rxjs';
import { SubSink } from 'subsink';
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

  private _sBs = new SubSink();

  file: File;
  audioInputId: string;
  isLoadingAudio: boolean;

  constructor(private _audioUploadService: FileStorageService) {}

  ngOnInit(): void {
    this.audioInputId = `aud-${this.id}`;
  }

  async processAudio(event: any) {
    this.file = event.target.files[0];

    if (this.file) {
      this.isLoadingAudio = true;

      //Step 1 - Create the file path that will be in firebase storage
      const audioFilePath = `audios/${this.file.name}_${new Date().getTime()}`;
      
      //Step 2 - Upload file to firestore
      const response = await this._audioUploadService.uploadSingleFile(this.file, audioFilePath);
      
      //Step 3 - PatchValue to Block
      this._sBs.sink = response.pipe(take(1)).subscribe((url) => this._autofillUrl(url));
    }
  }

  private _autofillUrl(url: string) {
    this.audioMessageForm.patchValue({ fileSrc: url });
    this.isLoadingAudio = false;
  }

  ngOnDestroy() {
    this._sBs.unsubscribe();
  }
}

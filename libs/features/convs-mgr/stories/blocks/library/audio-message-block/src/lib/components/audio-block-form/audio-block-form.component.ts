import {
  Component,
  OnInit,
  Input,
  OnDestroy,
} from '@angular/core';
import { FormGroup } from '@angular/forms';

import { SubSink } from 'subsink';
import { take } from 'rxjs';
import { BrowserJsPlumbInstance } from '@jsplumb/browser-ui';

import { FileStorageService } from '@app/state/file';
import { VoiceMessageBlock } from '@app/model/convs-mgr/stories/blocks/messaging';
import { ErrorBlocksService } from '@app/state/convs-mgr/stories/blocks';
import { BlockErrorTypes } from '@app/model/convs-mgr/stories/blocks/scenario';
import { StoryBlockTypes } from '@app/model/convs-mgr/stories/blocks/main';

@Component({
  selector: 'app-audio-block-form',
  templateUrl: './audio-block-form.component.html',
  styleUrl: './audio-block-form.component.scss',
})
export class AudioBlockFormComponent implements OnInit, OnDestroy {
  @Input() id: string;
  @Input() block: VoiceMessageBlock;
  @Input() audioMessageForm: FormGroup;
  @Input() jsPlumb: BrowserJsPlumbInstance;
  @Input() isEdit: boolean;

  private _sBs = new SubSink();

  audioName: string;

  file: File;
  audioInputId: string;
  isLoadingAudio: boolean;
  byPassedLimits: any[] = [];
  whatsappLimit: boolean;
  messengerLimit: boolean;

  constructor(
    private _audioUploadService: FileStorageService,
    private _errorBlock: ErrorBlocksService
  ) {}

  ngOnInit(): void {
    this.audioInputId = `aud-${this.id}`;
    const fileSize = this.audioMessageForm.get('fileSize')?.value;

    this.audioName = this.audioMessageForm.get('message')?.value || this.audioMessageForm.get('fileName')?.value || "";

    if (fileSize) {
      this._checkSizeLimit(fileSize);
    }

  }

  getClassObject(fileSrc: string) {
    if (fileSrc) return 'show'
    else return 'hide'
  }

  async processAudio(event: any) {
    this.file = event.target.files[0];
    const limits = this._audioUploadService.checkSupportedLimits(this.file.size, this.file.type, 'audio');

    if (limits?.typeNotAllowed){
      this._errorBlock.setErrorBlock({errorType: BlockErrorTypes.AudioFormat, isError: true, blockType: StoryBlockTypes.Audio})
      return;
    }

    if (this.file) {
      this.isLoadingAudio = true;

      //Step 1 - Create the file path that will be in firebase storage
      const audioFilePath = `audios/${this.file.name}_${new Date().getTime()}`;

      //Step 2 - Upload file to firestore
      const response = await this._audioUploadService.uploadSingleFile(
        this.file,
        audioFilePath
      );

      const fileSizeInKB = this.file.size / 1024;

      this.audioMessageForm.patchValue({fileName: this.file.name, message: this.file.name});

      this.audioName = this.audioMessageForm.get('message')?.value || this.file.name;

      //Step 3 - PatchValue to Block
      this._sBs.sink = response.pipe(take(1)).subscribe((url) => {
        this._autofillUrl(url, fileSizeInKB);
      });
    }
  }

  /** Step 3 Check if file bypasses size limit. */
  private _checkSizeLimit(fileSize: number) {
    this.byPassedLimits = this._audioUploadService.checkFileSizeLimits(
      fileSize,
      'audio'
    );

    if (this.byPassedLimits.find((limit) => limit.platform === 'WhatsApp')){
      this._errorBlock.setErrorBlock({errorType: BlockErrorTypes.AudioLimit, isError: true, blockType: StoryBlockTypes.Audio})
    }
    else if (
      this.byPassedLimits.find((limit) => limit.platform === 'messenger')
    )
      this.messengerLimit = true;
  }

  private _autofillUrl(url: string, fileSizeInKB: number) {
    this.audioMessageForm.patchValue({ fileSrc: url, fileSize: fileSizeInKB });
    this.block.fileSrc = url;
    this.isLoadingAudio = false;
    this._checkSizeLimit(fileSizeInKB);
  }

  ngOnDestroy() {
    this._sBs.unsubscribe();
  }
}

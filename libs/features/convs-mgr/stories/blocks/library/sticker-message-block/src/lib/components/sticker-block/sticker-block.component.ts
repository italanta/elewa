import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { take } from 'rxjs';
import { SubSink } from 'subsink';
import { BrowserJsPlumbInstance } from '@jsplumb/browser-ui';

import { FileStorageService } from '@app/state/file';
import { StickerMessageBlock } from '@app/model/convs-mgr/stories/blocks/messaging';

@Component({
  selector: 'app-sticker-block',
  templateUrl: './sticker-block.component.html',
  styleUrls: ['./sticker-block.component.scss'],
})
export class StickerBlockComponent implements OnInit, OnDestroy {
  @Input() id: string;
  @Input() block: StickerMessageBlock;
  @Input() stickerMessageForm: FormGroup;
  @Input() jsPlumb: BrowserJsPlumbInstance;

  file: File;
  isLoadingSticker: boolean;
  stickerInputId: string;
  byPassedLimits: any[] = [];

  private _sBs = new SubSink();

  constructor(private _stickerUploadService: FileStorageService) {}

  ngOnInit(): void {
    this.stickerInputId = `stckr-${this.id}`;
  }

  async processSticker(event: any) {
    this.file = event.target.files[0];
    
    const fileSizeInKB = this.file.size / 1024;
    this.byPassedLimits = this._checkSizeLimit(fileSizeInKB, 'sticker');

    if (this.file && !this.byPassedLimits.length) {
      this.isLoadingSticker = true;

      //Step 1 - Create the file path that will be in firebase storage
      const stickerFilePath = `stickers/${this.file.name}_${new Date().getTime()}`;

      //Step 2 - Upload file to firestore
      const response = await this._stickerUploadService.uploadSingleFile(this.file, stickerFilePath);

      //Step 3 - PatchValue to Block
      this._sBs.sink = response.pipe(take(1)).subscribe((url) => this._autofillUrl(url));
    }
  };

  private _checkSizeLimit(size:number, type:string) {
    return this._stickerUploadService.checkFileSizeLimits(size, type)
  }

  private _autofillUrl(url: string) {
    this.stickerMessageForm.patchValue({ fileSrc: url });
    this.isLoadingSticker = false;
  };

  ngOnDestroy() {
    this._sBs.unsubscribe();
  }
}
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

    const fileSize = this.stickerMessageForm.get('fileSize')?.value;

    if (fileSize) {
      this._checkSizeLimit(fileSize);
    }
  }

  async processSticker(event: any) {
    this.file = event.target.files[0];

    if (this.file) {
      this.isLoadingSticker = true;

      //Step 1 - Create the file path that will be in firebase storage
      const stickerFilePath = `stickers/${this.file.name}_${new Date().getTime()}`;

      //Step 2 - Upload file to firestore
      const response = await this._stickerUploadService.uploadSingleFile(this.file, stickerFilePath);
      
      //Step 3 Check if file bypasses size limit.
      const fileSizeInKB = this.file.size / 1024;

      //Step 4 - PatchValue to Block
      this._sBs.sink = response.pipe(take(1)).subscribe((url) => this._autofillUrl(url, fileSizeInKB));
    }
  };

  private _checkSizeLimit(size:number) {
    this.byPassedLimits = this._stickerUploadService.checkFileSizeLimits(size, 'sticker');
  }

  private _autofillUrl(url: string, fileSizeInKB: number) {
    this.stickerMessageForm.patchValue({ fileSrc: url });
    this.isLoadingSticker = false;
    this._checkSizeLimit(fileSizeInKB);
  };

  ngOnDestroy() {
    this._sBs.unsubscribe();
  }
}
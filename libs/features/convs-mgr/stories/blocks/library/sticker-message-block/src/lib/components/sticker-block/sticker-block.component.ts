import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { BrowserJsPlumbInstance } from '@jsplumb/browser-ui';

import { StickerMessageBlock } from '@app/model/convs-mgr/stories/blocks/messaging';

import { StoryBlockTypes } from '@app/model/convs-mgr/stories/blocks/main';
import { UploadFileService } from '@app/state/file';


@Component({
  selector: 'app-sticker-block',
  templateUrl: './sticker-block.component.html',
  styleUrls: ['./sticker-block.component.scss'],
})

export class StickerBlockComponent implements OnInit {

  @Input() id: string;
  @Input() block: StickerMessageBlock;
  @Input() stickerMessageForm: FormGroup;
  @Input() jsPlumb: BrowserJsPlumbInstance;

  file: File;
  isLoadingSticker: boolean;
  isStickerLoaded: string;
  stickerLink = "";
  stickerInputId: string;
  defaultImage = "assets/images/lib/block-builder/sticker-block-placeholder.png"

  type: StoryBlockTypes;
  stickerType = StoryBlockTypes.Sticker;
  blockFormGroup: FormGroup;


  constructor(private _stickerUploadService: UploadFileService) 
  { }

  ngOnInit(): void
  {
    this.stickerInputId = `stckr-${this.id}`
  }

  async processSticker(event: any) 
  {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e: any) => this.stickerLink = e.target.result;
      reader.readAsDataURL(event.target.files[0]);
      this.file = event.target.files[0];
    } else {
      this.stickerLink = this.defaultImage;
    }
    this.isLoadingSticker = true;
    const stickerFilePath = `stickers/${this.file.name}_${new Date().getTime()}`;
    (await this._stickerUploadService.uploadFile(this.file, this.block, stickerFilePath)).subscribe();
  }
}
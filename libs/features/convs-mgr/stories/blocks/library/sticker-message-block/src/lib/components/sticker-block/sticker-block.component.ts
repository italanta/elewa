import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

import { Logger } from '@iote/bricks-angular';
import { BrowserJsPlumbInstance } from '@jsplumb/browser-ui';

import { _JsPlumbComponentDecorator } from '@app/features/convs-mgr/stories/blocks/library/block-options';

import { StickerMessageBlock } from '@app/model/convs-mgr/stories/blocks/messaging';

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
  stickerLink: string = "";
  stickerInputId: string;
  defaultImage: string = "assets/images/lib/block-builder/sticker-block-placeholder.png"


  constructor(private _fb: FormBuilder,
    private _logger: Logger,
    private _stickerUploadService: UploadFileService) { }

  ngOnInit(): void
  {
    this.stickerInputId = `stckr-${this.id}`
  }

  ngAfterViewInit(): void
  {
    if (this.jsPlumb) {
      this._decorateInput();
    }
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

  private _decorateInput() 
  {
    let input = document.getElementById(this.stickerInputId) as Element;
    if (this.jsPlumb) {
      input = _JsPlumbComponentDecorator(input, this.jsPlumb);
    }
  }
}
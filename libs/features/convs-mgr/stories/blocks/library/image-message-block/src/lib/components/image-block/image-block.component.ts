import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';

import { BrowserJsPlumbInstance } from '@jsplumb/browser-ui';

import { _JsPlumbComponentDecorator } from '@app/features/convs-mgr/stories/blocks/library/block-options';

import { UploadFileService } from '@app/state/file';
import { StoryBlock, StoryBlockTypes } from '@app/model/convs-mgr/stories/blocks/main';
import { ImageMessageBlock } from '@app/model/convs-mgr/stories/blocks/messaging';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-image-block',
  templateUrl: './image-block.component.html',
  styleUrls: ['./image-block.component.scss'],
})

export class ImageBlockComponent implements OnInit {

  @Input() id: string;
  @Input() block: ImageMessageBlock;
  @Input() imageMessageForm: FormGroup;
  @Input() jsPlumb: BrowserJsPlumbInstance;

  type: StoryBlockTypes;
  imagetype = StoryBlockTypes.Image;
  blockFormGroup: FormGroup;


  file: File;
  imageInputId: string;
  imageName: string;
  isLoadingImage: boolean = false;
  imageLink: string;
  hasImage: boolean = false;
  url: Observable<string>;

  constructor(private _imageUploadService: UploadFileService,
    private _fbstorage: FileStorageService,
    public domSanitizer: DomSanitizer,

  ) {
    this.block = this.block as ImageMessageBlock;
  }

  ngOnInit(): void {
    this.imageInputId = `img-${this.id}`;

  }
  updateBlockForm() {
    this.imageMessageForm.patchValue({
      imageLink: this.block.fileSrc,
      caption: this.block.message
    });
    if (this.hasImage) {
      this.imageName = this.getFileNameFromFbUrl(this.block.fileSrc!)
    }

  }
  getFileNameFromFbUrl(fbUrl: string): string {
    return fbUrl.split('%2F')[1].split("?")[0];
  }
  update() {
    this.block.fileSrc = this.imageMessageForm.value.imageLink;
    this.block.message = this.imageMessageForm.value.caption;
  }
  async processImage(event: any) {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e: any) => this.imageLink = e.target.result;
      reader.readAsDataURL(event.target.files[0]);
      this.file = event.target.files[0];
      this.isLoadingImage = true;
      this.hasImage = true;
    }

    //Step 1 - Create the file path that will be in firebase storage
    const imgFilePath = `images/${this.file.name}_${new Date().getTime()}`;
    this.isLoadingImage = true;
    (await this._imageUploadService.uploadFile(this.file, this.block, imgFilePath)).subscribe();



  }
}


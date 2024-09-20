import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { BrowserJsPlumbInstance } from '@jsplumb/browser-ui';

import { SubSink } from 'subsink';

import { take } from 'rxjs/operators';

import { ImageMessageBlock } from '@app/model/convs-mgr/stories/blocks/messaging';
import { FileStorageService } from '@app/state/file';
import { ErrorBlocksService } from '@app/state/convs-mgr/stories/blocks';
import { BlockErrorTypes } from '@app/model/convs-mgr/stories/blocks/scenario';
import { StoryBlockTypes } from '@app/model/convs-mgr/stories/blocks/main';

@Component({
  selector: 'app-image-block-form',
  templateUrl: './image-block-form.component.html',
  styleUrl: './image-block-form.component.scss'
})
export class ImageBlockFormComponent {
  @Input() id: string;
  @Input() block: ImageMessageBlock;
  @Input() imageMessageForm: FormGroup;
  @Input() jsPlumb: BrowserJsPlumbInstance;
  @Input() isEdit: boolean;

  file: File;
  imageInputId: string;
  imageInputUpload = '';
  isLoadingImage = false;
  imageLink: string;
  hasImage = false;
  byPassedLimits: any[] = []
  whatsappLimit: boolean;
  messengerLimit: boolean;

  private _sBs = new SubSink();

  constructor(
    private _imageUploadService: FileStorageService,
    private _errorBlock: ErrorBlocksService,
  ) {}

  ngOnInit(): void {
    this.imageInputId = `img-${this.id}`;
    this.imageInputUpload = `img-${this.id}-upload`;
    this._checkIfImageExists();
  
    const fileSize = this.imageMessageForm.get('fileSize')?.value;
  
    if (fileSize) {
      this._checkSizeLimit(fileSize);
    }
  }

  async processImage(event: any) {   
    this.file = event.target.files[0]

    const limits = this._imageUploadService.checkSupportedLimits(this.file.size, this.file.type, 'image');

    if(limits?.typeNotAllowed){
      this._errorBlock.setErrorBlock({errorType: BlockErrorTypes.ImageFormat, isError: true, blockType: StoryBlockTypes.Image})
      return;
    }

    if (this.file) {
      this.isLoadingImage = true;
      this.hasImage = true;

      //Step 1 - Create the file path that will be in firebase storage
      const imgFilePath = `images/${this.file.name}`;

      //Step 2 - Upload file to firestore
      const response = await this._imageUploadService.uploadSingleFile(this.file, imgFilePath);

      const fileSizeInKB = this.file.size / 1024;

      //Step 3 - PatchValue to Block
      this._sBs.sink = response.pipe(take(1)).subscribe((url) => this._autofillUrl(url, fileSizeInKB));
    }
  }

  /** Check if file bypasses size limit. */
  private _checkSizeLimit(fileSize: number) {
    this.byPassedLimits = this._imageUploadService.checkFileSizeLimits(fileSize, 'image');

    if (this.byPassedLimits.find(limit => limit.platform === "WhatsApp")){
      this._errorBlock.setErrorBlock({errorType: BlockErrorTypes.ImageLimit, isError: true, blockType: StoryBlockTypes.Image})
    }
    else if (this.byPassedLimits.find(limit => limit.platform === "messenger")) this.messengerLimit = true;
  }

  private _checkIfImageExists() {
    this.imageLink = this.imageMessageForm.value.fileSrc;
    this.hasImage = !this.imageLink ? false : true;
  }

  private _autofillUrl(url: string, fileSizeInKB: number) {
    this.imageMessageForm.patchValue({ fileSrc: url, fileSize: fileSizeInKB });
    this.isLoadingImage = false;
    this._checkIfImageExists();
    this._checkSizeLimit(fileSizeInKB);
  }

  ngOnDestroy(): void {
    this._sBs.unsubscribe();
  }
}

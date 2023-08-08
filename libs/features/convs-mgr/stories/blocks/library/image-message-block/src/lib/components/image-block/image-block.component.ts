import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { take } from 'rxjs';
import { SubSink } from 'subsink';
import { BrowserJsPlumbInstance } from '@jsplumb/browser-ui';

import { FileStorageService } from '@app/state/file';
import { ImageMessageBlock } from '@app/model/convs-mgr/stories/blocks/messaging';

@Component({
  selector: 'app-image-block',
  templateUrl: './image-block.component.html',
  styleUrls: ['./image-block.component.scss'],
})

export class ImageBlockComponent implements OnInit, OnDestroy {

  @Input() id: string;
  @Input() block: ImageMessageBlock;
  @Input() imageMessageForm: FormGroup;
  @Input() jsPlumb: BrowserJsPlumbInstance;

  file: File;
  imageInputId: string;
  imageInputUpload = '';
  isLoadingImage = false;
  imageLink: string;
  hasImage = false;
  byPassedLimits: any[] = [];

  private _sBs = new SubSink();

  constructor(private _imageUploadService: FileStorageService) {}

  ngOnInit(): void {
    this.imageInputId = `img-${this.id}`;
    this.imageInputUpload = `img-${this.id}-upload`;
    this.checkIfImageExists();
    this.checkFileLimits();
  }

  checkIfImageExists() {
    this.imageLink = this.imageMessageForm.value.fileSrc;
    this.hasImage = this.imageLink != '' ? true : false;
  }

  checkFileLimits() {
    // Check if file bypasses size limit.
    if (this.file) {
      const fileSizeInKB = this.file.size / 1024;
      this.byPassedLimits = this._checkSizeLimit(fileSizeInKB, 'image');
    };
  }

  async processImage(event: any) {   
    const allowedFileTypes = ['image/jpeg', 'image/png', 'image/gif']
    this.file = event.target.files[0]

    if (!allowedFileTypes.includes(event.target.files[0].type)) {
      this._imageUploadService.openErrorModal("Invalid File Type", "Please select an image file (.jpg, .jpeg, .png) only.");
      return;
    }

    if (this.file) {
      this.isLoadingImage = true;
      this.hasImage = true;

      //Step 1 - Create the file path that will be in firebase storage
      const imgFilePath = `images/${this.file.name}`;

      //Step 2 - Upload file to firestore
      const response = await this._imageUploadService.uploadSingleFile(this.file, imgFilePath);

      //Step 3 - PatchValue to Block
      this._sBs.sink = response.pipe(take(1)).subscribe((url) => this._autofillUrl(url));
    }
  }

  private _checkSizeLimit(size:number, type:string) {
    return this._imageUploadService.checkFileSizeLimits(size, type);
  };

  private _autofillUrl(url: string) {
    this.imageMessageForm.patchValue({fileSrc: url});
    this.isLoadingImage = false;
    this.checkIfImageExists()
  }

  ngOnDestroy(): void {
    this._sBs.unsubscribe();
  }
}

import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { BrowserJsPlumbInstance } from '@jsplumb/browser-ui';

import { SubSink } from 'subsink';

import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

import { ImageMessageBlock } from '@app/model/convs-mgr/stories/blocks/messaging';
import { FileStorageService } from '@app/state/file';

@Component({
  selector: 'app-image-block-form',
  templateUrl: './image-block-form.component.html',
  styleUrl: './image-block-form.component.scss'
})
export class ImageBlockFormComponent implements OnInit {
  @Input() id: string;
  @Input() block: ImageMessageBlock;
  @Input() imageMessageForm: FormGroup;
  @Input() jsPlumb: BrowserJsPlumbInstance;
  @Input() isEdit: boolean;

  file: File;
  imageInputId: string;
  imageInputUpload = '';
  imageLink: string;
  hasImage = false;
  byPassedLimits: any[] = []
  whatsappLimit: boolean;
  messengerLimit: boolean;

  isLoading$: Observable<Map<string, boolean>>;

  private _sBs = new SubSink();

  constructor(private _imageUploadService: FileStorageService) {}

  ngOnInit(): void {
    this.imageInputId = `img-${this.id}`;
    this.imageInputUpload = `img-${this.id}-upload`;
    this._checkIfImageExists();

    this.isLoading$ = this._imageUploadService.isLoading$;
  
    const fileSize = this.imageMessageForm.get('fileSize')?.value;
  
    if (fileSize) {
      this._checkSizeLimit(fileSize);
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
      this._imageUploadService.setIsLoading(this.id, true);
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

    if (this.byPassedLimits.find(limit => limit.platform === "WhatsApp")) this.whatsappLimit = true;
    else if (this.byPassedLimits.find(limit => limit.platform === "messenger")) this.messengerLimit = true;
  }

  private _checkIfImageExists() {
    this.imageLink = this.imageMessageForm.value.fileSrc;
    this.hasImage = !this.imageLink ? false : true;
  }

  private _autofillUrl(url: string, fileSizeInKB: number) {
    this.imageMessageForm.patchValue({ fileSrc: url, fileSize: fileSizeInKB });
    this._imageUploadService.setIsLoading(this.id, false);
    this._checkIfImageExists();
    this._checkSizeLimit(fileSizeInKB);
  }

  ngOnDestroy(): void {
    this._sBs.unsubscribe();
  }
}

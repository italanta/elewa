import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { take } from 'rxjs';
import { SubSink } from 'subsink';

import { BrowserJsPlumbInstance } from '@jsplumb/browser-ui';

import { StoryBlockTypes } from '@app/model/convs-mgr/stories/blocks/main';
import { ImageMessageBlock } from '@app/model/convs-mgr/stories/blocks/messaging';

import { FileStorageService } from '@app/state/file';

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

  type: StoryBlockTypes;
  imagetype = StoryBlockTypes.Image;
  blockFormGroup: FormGroup;


  file: File;
  imageInputId: string;
  imageInputUpload = '';
  imageName: string;
  isLoadingImage = false;
  imageLink: string;
  hasImage = false;

  private _sBs = new SubSink();

  constructor(private _imageUploadService: FileStorageService) {}

  ngOnInit(): void {
    this.imageInputId = `img-${this.id}`;
    this.imageInputUpload = `img-${this.id}-upload`;
    this.checkIfImageExists();
  }

  checkIfImageExists() {
    this.imageLink = this.imageMessageForm.value.fileSrc;
    this.hasImage = this.imageLink != '' ? true : false;
  }

  async processImage(event: any) {   
    const allowedFileTypes = ['image/jpeg', 'image/png', 'image/gif']

    if (!allowedFileTypes.includes(event.target.files[0].type)) {
      this._imageUploadService.openErrorModal("Invalid File Type", "Please select an image file (.jpg, .jpeg, .png) only.");
      return;
    }

    if (event.target.files && event.target.files[0]) {
      this.file = event.target.files[0];
      this.isLoadingImage = true;
      this.hasImage = true;

      //Step 1 - Create the file path that will be in firebase storage
      const imgFilePath = `images/${this.file.name}`;
      this.isLoadingImage = true;

      const response = await this._imageUploadService.uploadSingleFile(this.file, imgFilePath)
      this._sBs.sink = response.pipe(take(1)).subscribe((url) => this._autofillUrl(url));
    }
  }

  private _autofillUrl(url: string) {
    this.imageMessageForm.patchValue({fileSrc: url});
    this.isLoadingImage = false;
    this.checkIfImageExists()
  }

  ngOnDestroy(): void {
    this._sBs.unsubscribe();
  }
}

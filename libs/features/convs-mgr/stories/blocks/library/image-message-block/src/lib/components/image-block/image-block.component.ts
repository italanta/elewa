import { Component, OnInit, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';

import { take } from 'rxjs';

import { BrowserJsPlumbInstance } from '@jsplumb/browser-ui';

import { StoryBlockTypes } from '@app/model/convs-mgr/stories/blocks/main';
import { ImageMessageBlock } from '@app/model/convs-mgr/stories/blocks/messaging';

import { FileStorageService } from '@app/state/file';

import { _JsPlumbComponentDecorator } from '@app/features/convs-mgr/stories/blocks/library/block-options';

import { MatDialog } from '@angular/material/dialog';

import { ErrorPromptModalComponent } from '@app/elements/layout/modals';

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
  imageInputUpload: string = '';
  imageName: string;
  isLoadingImage: boolean = false;
  imageLink: string;
  hasImage: boolean = false;


  constructor(private _imageUploadService: UploadFileService,
    public domSanitizer: DomSanitizer,
    private dialog: MatDialog
) {
this.block = this.block as ImageMessageBlock;
}

  ngOnInit(): void {
    this.imageInputId = `img-${this.id}`;
    this.imageInputUpload = `img-${this.id}-upload`;

    this.checkIfImageExists();
  }

  checkIfImageExists() {
    this.imageLink = this.imageMessageForm.value.fileSrc;
    this.hasImage = this.imageLink && this.imageLink != '' ? true : false;
  }

  getFileNameFromFbUrl(fbUrl: string): string {
    return fbUrl.split('%2F')[1].split("?")[0];
  }

  openErrorModal() {
    this.dialog.open(ErrorPromptModalComponent, {
      width: '400px',
      data: {
        title: 'Invalid File Type',
        message: 'Please select an image file (.jpg, .jpeg, .png) only.'
      }
    });
  }
  

  async processImage(event: any) 
  {
    const allowedFileTypes = ['image/jpeg', 'image/png', 'image/gif'];
  const selectedFileType = event.target.files[0].type;

  if (!allowedFileTypes.includes(selectedFileType)) {
    //error modal displayed here
    this.openErrorModal();
    return;
  }

    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e: any) => this.imageLink = e.target.result;
      reader.readAsDataURL(event.target.files[0]);
      this.file = event.target.files[0];
      this.isLoadingImage = true;
      this.hasImage = true;
    }

    //Step 1 - Create the file path that will be in firebase storage
    const imgFilePath = `images/${this.file.name}`;
    this.isLoadingImage = true;

    this._imageUploadService.uploadSingleFile(this.file, imgFilePath).then((url) => {
      url.pipe(take(1)).subscribe((url) => this._autofillUrl(url));
    })
  }

  private _autofillUrl(url: string) {
    this.imageMessageForm.patchValue({fileSrc: url});
    this.isLoadingImage = false;
  }
}


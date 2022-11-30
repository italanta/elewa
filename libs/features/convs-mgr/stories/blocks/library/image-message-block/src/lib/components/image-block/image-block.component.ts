import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';

import { BrowserJsPlumbInstance } from '@jsplumb/browser-ui';

import { _JsPlumbComponentDecorator } from '@app/features/convs-mgr/stories/blocks/library/block-options';

import { UploadFileService } from '@app/state/file';

import { ImageMessageBlock } from '@app/model/convs-mgr/stories/blocks/messaging';

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


  file: File;
  imageInputId: string;
  imageName: string = '';
  isLoadingImage: boolean = false;
  defaultImage: string = "assets/images/lib/block-builder/image-block-placeholder.jpg"
  imageLink = this.defaultImage;



  constructor(private _imageUploadService: UploadFileService,
              public domSanitizer: DomSanitizer) 
              { }

  ngOnInit(): void
  {
    this.imageInputId = `img-${this.id}`;
  }

  ngAfterViewInit(): void 
  {
    if (this.jsPlumb) {
      this._decorateInput();
    }
  }



  async processImage(event: any) 
  {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e: any) => this.imageLink = e.target.result;
      reader.readAsDataURL(event.target.files[0]);
      this.file = event.target.files[0];
      this.isLoadingImage = true;
    } else {
      this.imageLink = this.defaultImage;
    }
    //Step 1 - Create the file path that will be in firebase storage
    const imgFilePath = `images/${this.file.name}_${new Date().getTime()}`;
    this.isLoadingImage = true;
    (await this._imageUploadService.uploadFile(this.file, this.block,imgFilePath)).subscribe();

  }

  private _decorateInput() 
  {
    let input = document.getElementById(this.imageInputId) as Element;
    if (this.jsPlumb) {
      input = _JsPlumbComponentDecorator(input, this.jsPlumb);
    }
  }
}
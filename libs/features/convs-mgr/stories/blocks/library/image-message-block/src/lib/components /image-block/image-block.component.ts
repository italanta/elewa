import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

import { Logger } from '@iote/bricks-angular';
import { BrowserJsPlumbInstance } from '@jsplumb/browser-ui';

import { ImageMessageBlock } from '@app/model/convs-mgr/stories/blocks/messaging';

import { ImageUploadService } from '../../providers/image-upload.service';
import { _JsPlumbComponentDecorator } from '../../providers/image-jsplumb-decorator.function';
import { Storage, ref, uploadBytesResumable, getDownloadURL } from '@angular/fire/storage';



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

  imageLink: string = "";
  fileReader = new FileReader();
  isLoadingImage: boolean = false;
  file: File;
  imageInputId: string;
  defaultImage: string ="assets/images/image-placeholder.jpg"


  constructor(private _fb: FormBuilder,
    private _logger: Logger,
    private _imageUploadService: ImageUploadService) { }

  ngOnInit(): void {
    this.imageInputId = `image-${this.id}`
  }

  ngAfterViewInit(): void {
    if (this.jsPlumb) {
      this._decorateInput();
    }
  }

  processImage(event: any) {
    this.file = event.target.files[0];
    this.fileReader.readAsDataURL(this.file);
    this.fileReader.onload = () => {
      this.isLoadingImage = true;
      this.imageLink = this.fileReader.result as string;
    }

  }

  private _decorateInput() {
    let input = document.getElementById(this.imageInputId) as Element;
    if (this.jsPlumb) {
      input = _JsPlumbComponentDecorator(input, this.jsPlumb);
    }
  }
}

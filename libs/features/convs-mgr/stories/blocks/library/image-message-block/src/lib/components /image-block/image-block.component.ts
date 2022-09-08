import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

import { Logger } from '@iote/bricks-angular';
import { BrowserJsPlumbInstance } from '@jsplumb/browser-ui';

import { ImageMessageBlock } from '@app/model/convs-mgr/stories/blocks/messaging';

import { ImageUploadService } from '../../providers/image-upload.service';
import { _JsPlumbComponentDecorator } from '../../providers/image-jsplumb-decorator.function';
import { Storage,ref,uploadBytesResumable, getDownloadURL } from  '@angular/fire/storage';



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
  fileReader= new FileReader();
  isLoadingImage: boolean = false;
  file: File;


  constructor(private _fb: FormBuilder,
    private _logger: Logger,
    private _imageUploadService: ImageUploadService) { }

  ngOnInit(): void { }

  ngAfterViewInit(): void {
    if (this.jsPlumb) {
      this._decorateInput();
    }
  }

  processImage(event: any) {
    this.file = event.target.files[0];
    
  }

  onUpload() {

    this.isLoadingImage = !this.isLoadingImage;
    this._imageUploadService.upload(this.file).subscribe((event: any) => {
      if (typeof (event) === 'object') {
        this.imageLink  = event.link;
        this.isLoadingImage = false;
      }
      ;
    });

  }

  private _decorateInput() {
    let input = document.getElementById('fileSrc') as Element;
    if (this.jsPlumb) {
      input = _JsPlumbComponentDecorator(input, this.jsPlumb);
    }
  }
}

import { finalize, map } from 'rxjs/operators';

import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AngularFireDatabase } from '@angular/fire/compat/database';

import { Logger } from '@iote/bricks-angular';
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




  isLoadingImage: boolean = false;
  imageInputId: string;
  defaultImage: string = "assets/images/lib/block-builder/image-block-placeholder.jpg"
  file: File;
  imageLink: string = this.defaultImage;
  imageName: string = '';


  constructor(private _fb: FormBuilder,
    private _logger: Logger,
    private _imageUploadService: UploadFileService,
    public domSanitizer: DomSanitizer,
    private _ngfiStorage: AngularFireStorage,
    private _db: AngularFireDatabase) { }

  ngOnInit(): void {
    this.imageInputId = `img-${this.id}`;

  }

  ngAfterViewInit(): void {
    if (this.jsPlumb) {
      this._decorateInput();
    }
  }

  onKey(value: string) {
    this.imageName += value;
  }

  processImage(event: any)
  {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e: any) => this.imageLink = e.target.result;
      reader.readAsDataURL(event.target.files[0]);
      this.file = event.target.files[0];
      this.isLoadingImage = true;
    
    }else 
    {
      this.imageLink = this.defaultImage;
    }
      this.isLoadingImage = true;
      this._imageUploadService.uploadFile(this.file , this.block, this.block.type, this.imageMessageForm);
        
  }
  

  private _decorateInput() {
    let input = document.getElementById(this.imageInputId) as Element;
    if (this.jsPlumb) {
      input = _JsPlumbComponentDecorator(input, this.jsPlumb);
    }
  }
}
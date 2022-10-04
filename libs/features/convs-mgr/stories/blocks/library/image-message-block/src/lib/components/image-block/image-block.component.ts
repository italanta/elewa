
import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AngularFireDatabase } from '@angular/fire/compat/database';

import { Logger } from '@iote/bricks-angular';
import { BrowserJsPlumbInstance } from '@jsplumb/browser-ui';
import { finalize } from 'rxjs/operators';

import { _JsPlumbComponentDecorator } from '@app/features/convs-mgr/stories/blocks/library/block-options';
import { FileUpload, UploadFileService } from '@app/state/file';

import { ImageMessageBlock } from '@app/model/convs-mgr/stories/blocks/messaging';
import { isArgumentsObject } from 'util/types';

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
    private storage: AngularFireStorage,
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

  processImage(event: any) {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e: any) => this.imageLink = e.target.result;
      reader.readAsDataURL(event.target.files[0]);
      this.file = event.target.files[0];
    } else {
      this.imageLink = this.defaultImage;
    }
    this.isLoadingImage = true;
    var imgFilePath = `images/${this.file.name}_${new Date().getTime()}`;
    this.imageMessageForm.patchValue({src: imgFilePath})
    const imgFileRef = this.storage.ref(imgFilePath);
    this.storage.upload(imgFilePath, this.file).snapshotChanges().pipe(finalize(() => {
    imgFileRef.getDownloadURL().subscribe((url: string) => {
      this.imageLink = url;
      debugger
       this._imageUploadService.upload(this.block, url, this.block.type, this.file);
      })
    })
    ).subscribe();
  
  }



  

  private _decorateInput() {
    let input = document.getElementById(this.imageInputId) as Element;
    if (this.jsPlumb) {
      input = _JsPlumbComponentDecorator(input, this.jsPlumb);
    }
  }
}
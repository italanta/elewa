import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { Logger } from '@iote/bricks-angular';
import { BrowserJsPlumbInstance } from '@jsplumb/browser-ui';

import { DocumentMessageBlock } from '@app/model/convs-mgr/stories/blocks/messaging';

import { _JsPlumbComponentDecorator } from '@app/features/convs-mgr/stories/blocks/library/block-options';

import { UploadFileService } from '@app/state/file';

@Component({
  selector: 'app-document-block',
  templateUrl: './document-block.component.html',
  styleUrls: ['./document-block.component.scss'],
})
export class DocumentBlockComponent implements OnInit {

  @Input() id: string;
  @Input() block: DocumentMessageBlock;
  @Input() documentMessageForm: FormGroup;
  @Input() jsPlumb: BrowserJsPlumbInstance;

 
  file: File;
  docInputId: string;
  docName: string = '';
  defaultLink: string ="assets/images/lib/block-builder/docs-block-placeholder.png";
  isDocLoading: boolean = false;
  docLink: string =  this.defaultLink;

 

  constructor(private _docUploadService: UploadFileService)
              {}

  ngOnInit(): void 
  {
    this.docInputId = `docs-${this.id}`;
  }

  ngAfterViewInit(): void
   {
    if (this.jsPlumb) {
      this._decorateInput();
    }
  }


  private _decorateInput()
   {
    let input = document.getElementById(this.docInputId) as Element;
    if (this.jsPlumb) {
      input = _JsPlumbComponentDecorator(input, this.jsPlumb);
    }
  }

  async processDocs(event: any)
  {   
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e: any) => this.docLink = e.target.result;
      reader.readAsDataURL(event.target.files[0]);
      this.file = event.target.files[0];
      this.isDocLoading = true;
    } else {
      this.docLink = this.defaultLink;
    }
    this.isDocLoading= true;
      //Step 1 - Create the file path that will be in firebase storage
     const docFilePath = `docs/${this.file.name}_${new Date().getTime()}`;
    (await this._docUploadService.uploadFile(this.file, this.block, docFilePath)).subscribe();
    console.log(this.isDocLoading);

  }
}
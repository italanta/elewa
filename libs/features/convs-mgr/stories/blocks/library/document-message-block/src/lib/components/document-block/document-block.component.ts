import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { SubSink } from 'subsink';

import { BrowserJsPlumbInstance } from '@jsplumb/browser-ui';

import { DocumentMessageBlock } from '@app/model/convs-mgr/stories/blocks/messaging';
import { StoryBlockTypes } from '@app/model/convs-mgr/stories/blocks/main';

import { FileStorageService } from '@app/state/file';


@Component({
  selector: 'app-document-block',
  templateUrl: './document-block.component.html',
  styleUrls: ['./document-block.component.scss'],
})
export class DocumentBlockComponent implements OnInit, OnDestroy  {

  @Input() id: string;
  @Input() block: DocumentMessageBlock;
  @Input() documentMessageForm: FormGroup;
  @Input() jsPlumb: BrowserJsPlumbInstance;

  file: File;
  docInputId: string;
  docName = '';
  defaultLink = "";
  isDocLoading = false;
  docLink: string =  this.defaultLink;
  
  type: StoryBlockTypes;
  documentType = StoryBlockTypes.Document;

  private _sBs = new SubSink();  //SubSink instance

  constructor(private _docUploadService: FileStorageService){ }

  ngOnInit(): void 
  {
    this.docInputId = `docs-${this.id}`;
  }

  async processDocs(event: any)
  {   

    const allowedFileTypes = ['application/pdf'];

    if (!allowedFileTypes.includes(event.target.files[0].type)) {
      this._docUploadService.openErrorModal("Invalid File Type", "Please select a .pdf only.");
      return;
    }

    if (event.target.files[0]) {
      this.file = event.target.files[0];
      this.isDocLoading = true;
    } else {
      this.docLink = this.defaultLink;
    }
  
    this.isDocLoading= true;

    const docFilePath = `docs/${this.file.name}_${new Date().getTime()}`;
    const response = await this._docUploadService.uploadSingleFile(this.file, docFilePath)
    this._sBs.sink = response.subscribe(url => this._autofillDocUrl(url))
  }

  private _autofillDocUrl(url: any) {
    this.documentMessageForm.patchValue({ fileSrc: url });
    this.isDocLoading = false;
  }

  ngOnDestroy(): void {
    this._sBs.unsubscribe();
  }
}
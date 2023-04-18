import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { catchError, of } from 'rxjs';
import { SubSink } from 'subsink';

import { BrowserJsPlumbInstance } from '@jsplumb/browser-ui';

import { DocumentMessageBlock } from '@app/model/convs-mgr/stories/blocks/messaging';
import { StoryBlockTypes } from '@app/model/convs-mgr/stories/blocks/main';

import { FileStorageService, UploadFileService } from '@app/state/file';

import { _JsPlumbComponentDecorator } from '@app/features/convs-mgr/stories/blocks/library/block-options';


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
  docName: string = '';
  defaultLink: string ="";
  isDocLoading: boolean = false;
  docLink: string =  this.defaultLink;
  
  type: StoryBlockTypes;
  documentType = StoryBlockTypes.Document;

  private _sBs = new SubSink();  //SubSink instance

  constructor(private _docUploadService: UploadFileService,
    private _fileStorageService: FileStorageService
    )
  { }

  ngOnInit(): void 
  {
    this.docInputId = `docs-${this.id}`;
  }

  ngAfterViewInit(): void {}

  async processDocs(event: any)
  {   

    const allowedFileTypes = ['application/pdf'];

    if (!allowedFileTypes.includes(event.target.files[0].type)) {
      //error modal displayed here
       this._fileStorageService.openErrorModal("Invalid File Type", "Please select a .pdf only.");
      event.target.value = '' //clear input
       return;
    }

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
     this._sBs.sink = (await this._docUploadService.uploadFile(this.file, this.block, docFilePath))
     .pipe(
       catchError(error => {
         console.error('Error uploading file:', error);
         // show error message to user
         this._fileStorageService.openErrorModal("Error occurred", "Try again later.");
         event.target.value = '' //clear input
         return of(null);
       })
     )
     .subscribe(() => {
       this.isDocLoading = false;
     });
  }

  ngOnDestroy(): void {
    this._sBs.unsubscribe(); // unsubscribe from all subscriptions
  }
}
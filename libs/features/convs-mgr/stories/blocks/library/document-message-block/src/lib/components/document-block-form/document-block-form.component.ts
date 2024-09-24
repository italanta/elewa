import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { SubSink } from 'subsink';
import { Observable } from 'rxjs';

import { BrowserJsPlumbInstance } from '@jsplumb/browser-ui';

import { FileStorageService } from '@app/state/file';
import { DocumentMessageBlock } from '@app/model/convs-mgr/stories/blocks/messaging';
import { ErrorBlocksService } from '@app/state/convs-mgr/stories/blocks';
import { BlockErrorTypes } from '@app/model/convs-mgr/stories/blocks/scenario';
import { StoryBlockTypes } from '@app/model/convs-mgr/stories/blocks/main';

@Component({
  selector: 'app-document-block-form',
  templateUrl: './document-block-form.component.html',
  styleUrl: './document-block-form.component.scss',
})
export class DocumentBlockFormComponent implements OnInit, OnDestroy {
  @Input() id: string;
  @Input() block: DocumentMessageBlock;
  @Input() documentMessageForm: FormGroup;
  @Input() jsPlumb: BrowserJsPlumbInstance;
  @Input() isEdit: boolean;

  file: File;
  docInputId: string;
  byPassedLimits: any[] = []
  whatsappLimit: boolean;
  messengerLimit: boolean;

  docName: string;
  isLoading$: Observable<Map<string, boolean>>;
  
  docInputUpload = '';

  private _sBs = new SubSink();

  constructor(
    private _docUploadService: FileStorageService,
    private _errorBlock: ErrorBlocksService
  ) {}

  ngOnInit(): void {
    this.docInputId = `docs-${this.id}`;
    this.docInputUpload = `doc-${this.id}-upload`;
    this.isLoading$ = this._docUploadService.isLoading$;
    const fileSize = this.documentMessageForm.get('fileSize')?.value;

    this.docName = this.documentMessageForm.get('message')?.value || this.documentMessageForm.get('fileName')?.value || "";

    if (fileSize) {
      this._checkSizeLimit(fileSize);
    }
  }

  async processDocs(event: any) {
    this.file = event.target.files[0];

    const limits = this._docUploadService.checkSupportedLimits(this.file.size, this.file.type, 'document');

    if(limits?.typeNotAllowed){
      this._errorBlock.setErrorBlock({errorType: BlockErrorTypes.DocumentFormat, isError: true, blockType: StoryBlockTypes.Document});
      return;
    }
    if (this.file) {
      this._docUploadService.setIsLoading(this.id, true);
      //Step 1 - Create the file path that will be in firebase storage
      const docFilePath = `docs/${this.file.name}_${new Date().getTime()}`;

      //Step 2 - Upload file to firestore
      const response = await this._docUploadService.uploadSingleFile(this.file, docFilePath);

      const fileSizeInKB = this.file.size / 1024;

      this.documentMessageForm.patchValue({fileName: this.file.name, message: this.file.name});

      this.docName = this.documentMessageForm.get('message')?.value || this.file.name;

      //Step 3 - PatchValue to Block
      this._sBs.sink = response.subscribe(url => this._autofillDocUrl(url, fileSizeInKB));
    }
  }

  /** Check if file bypasses size limit. */
  private _checkSizeLimit(fileSize: number) {
    this.byPassedLimits = this._docUploadService.checkFileSizeLimits(fileSize, 'document');

    if (this.byPassedLimits.find(limit => limit.platform === "WhatsApp")){
      this._errorBlock.setErrorBlock({errorType: BlockErrorTypes.DocumentLimit, isError: true, blockType: StoryBlockTypes.Document})
    }
    else if (this.byPassedLimits.find(limit => limit.platform === "messenger")) this.messengerLimit = true;
  }

  private _autofillDocUrl(url: string, fileSizeInKB: number) {
    this.documentMessageForm.patchValue({ fileSrc: url, fileSize: fileSizeInKB });
    this._docUploadService.setIsLoading(this.id, false);
    this._checkSizeLimit(fileSizeInKB);
  }

  ngOnDestroy(): void {
    this._sBs.unsubscribe();
  }
}
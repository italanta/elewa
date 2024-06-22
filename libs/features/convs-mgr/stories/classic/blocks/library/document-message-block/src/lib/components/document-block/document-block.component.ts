import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { SubSink } from 'subsink';
import { BrowserJsPlumbInstance } from '@jsplumb/browser-ui';

import { FileStorageService } from '@app/state/file';
import { DocumentMessageBlock } from '@app/model/convs-mgr/stories/blocks/messaging';

import { ICONS_AND_TITLES } from '../../../../../main/src/lib/assets/icons-and-titles';

@Component({
  selector: 'app-document-block',
  templateUrl: './document-block.component.html',
  styleUrls: ['./document-block.component.scss'],
})
export class DocumentBlockComponent implements OnInit, OnDestroy {
  @Input() id: string;
  @Input() block: DocumentMessageBlock;
  @Input() documentMessageForm: FormGroup;
  @Input() jsPlumb: BrowserJsPlumbInstance;

  file: File;
  docInputId: string;
  isDocLoading = false;
  byPassedLimits: any[] = []
  whatsappLimit: boolean;
  messengerLimit: boolean;

  svgIcon: string

  private _sBs = new SubSink();

  constructor(private _docUploadService: FileStorageService) {}

  ngOnInit(): void {
    this.docInputId = `docs-${this.id}`;

    this.svgIcon = this.getBlockIconAndTitle(this.block.type).svgIcon

    const fileSize = this.documentMessageForm.get('fileSize')?.value

    if (fileSize) {
      this._checkSizeLimit(fileSize);
    }
  }

  getBlockIconAndTitle(type: number) {
    return ICONS_AND_TITLES[type];
  }

  async processDocs(event: any) {
    const allowedFileTypes = ['application/pdf'];
    this.file = event.target.files[0];

    if (!allowedFileTypes.includes(event.target.files[0].type)) {
      this._docUploadService.openErrorModal("Invalid File Type", "Please select a .pdf only.");
      return;
    };

    if (this.file) {
      this.isDocLoading = true;

      //Step 1 - Create the file path that will be in firebase storage
      const docFilePath = `docs/${this.file.name}_${new Date().getTime()}`;

      //Step 2 - Upload file to firestore
      const response = await this._docUploadService.uploadSingleFile(this.file, docFilePath);

      const fileSizeInKB = this.file.size / 1024;

      //Step 3 - PatchValue to Block
      this._sBs.sink = response.subscribe(url => this._autofillDocUrl(url, fileSizeInKB));
    }
  }

  /** Check if file bypasses size limit. */
  private _checkSizeLimit(fileSize: number) {
    this.byPassedLimits = this._docUploadService.checkFileSizeLimits(fileSize, 'document');

    if (this.byPassedLimits.find(limit => limit.platform === "WhatsApp")) this.whatsappLimit = true;
    else if (this.byPassedLimits.find(limit => limit.platform === "messenger")) this.messengerLimit = true;
  }

  private _autofillDocUrl(url: string, fileSizeInKB: number) {
    this.documentMessageForm.patchValue({ fileSrc: url, fileSize: fileSizeInKB });
    this.isDocLoading = false;
    this._checkSizeLimit(fileSizeInKB);
  }

  ngOnDestroy(): void {
    this._sBs.unsubscribe();
  }
}
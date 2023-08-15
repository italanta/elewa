
import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { StoryBlockTypes } from '@app/model/convs-mgr/stories/blocks/main';
import { CMI5Block } from '@app/model/convs-mgr/stories/blocks/messaging';
import { FileStorageService } from '@app/state/file';
import { BrowserJsPlumbInstance } from '@jsplumb/browser-ui';



@Component({
  selector: 'app-cmi5-block',
  templateUrl: './cmi5-block.component.html',
  styleUrls: ['./cmi5-block.component.scss'],
})
export class Cmi5BlockComponent {
 
  @Input() id: string;
  @Input() block: CMI5Block;
  @Input() CMI5BlockForm: FormGroup;
  @Input() jsPlumb: BrowserJsPlumbInstance;

  file: File;
  courseId: string;
  docName = '';
  defaultLink = "";
  isDocLoading = false;
  docLink: string =  this.defaultLink;
  
  type: StoryBlockTypes;
  documentType = StoryBlockTypes.Document;

  // private _sBs = new SubSink();  //SubSink instance

  constructor(private _docUploadService: FileStorageService){ }

  ngOnInit(): void 
  {
    this.courseId = `docs-${this.id}`;
  }

  async processDocs(event: any)
  {   

    const allowedFileTypes = ['application/zip'];

    if (!allowedFileTypes.includes(event.target.files[0].type)) {
      this._docUploadService.openErrorModal("Invalid File Type", "Please select a .zip only.");
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
    // this._sBs.sink = response.subscribe(url => this._autofillDocUrl(url))
  }

  private _autofillDocUrl(url: any) {
    // this.documentMessageForm.patchValue({ fileSrc: url });
    this.isDocLoading = false;
  }

  ngOnDestroy(): void {
    // this._sBs.unsubscribe();
  }

}
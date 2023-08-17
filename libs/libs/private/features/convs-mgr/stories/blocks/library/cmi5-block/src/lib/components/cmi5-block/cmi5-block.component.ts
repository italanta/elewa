// cmi5 is a “profile” for using the xAPI specification with traditional learning management (LMS) systems.

// "Since the xAPI specification is highly generalized to support many different use cases, a set of “extra rules” (called a “profile”) is needed to ensure interoperability for a given use case. The cmi5 profile ensures plug and play interoperability between learning content and LMS systems."

// and this: @see https://aicc.github.io/CMI-5_Spec_Current/flows/cmi5-overview.html
import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';

import { take } from 'rxjs';
import { SubSink } from 'subsink';

import { BrowserJsPlumbInstance } from '@jsplumb/browser-ui';
import { TranslateService } from '@ngfi/multi-lang';

import { StoryBlockTypes } from '@app/model/convs-mgr/stories/blocks/main';
import { CMI5Block } from '@app/model/convs-mgr/stories/blocks/messaging';
import { FileStorageService } from '@app/state/file';

@Component({
selector: 'app-cmi5-block',
templateUrl: './cmi5-block.component.html',
styleUrls: ['./cmi5-block.component.scss'],
})
export class Cmi5BlockComponent implements OnInit, OnDestroy {
@Input() id: string;
@Input() block: CMI5Block;
@Input() CMI5BlockForm: FormGroup;
@Input() jsPlumb: BrowserJsPlumbInstance;

file: File;
courseId: string;
docName = '';
defaultLink = '';
isDocLoading = false;
docLink: string = this.defaultLink;
type: StoryBlockTypes;
documentType = StoryBlockTypes.Document;
hasDocument = false;

private _sBs = new SubSink(); //SubSink instance

optionClass: string;
CMI5BlockOptions: any[];

jumpType = StoryBlockTypes.JumpBlock;
blockFormGroup: FormGroup;

constructor(
private _cmi5UploadService: FileStorageService,
private _fb: FormBuilder,
private _translate: TranslateService
) {}

ngOnInit(): void {
this.courseId = `docs-${this.id}`;
this.setCMI5BlockOptions();
}

get options(): FormArray {
return this.CMI5BlockForm.controls['options'] as FormArray;
}

addCMI5Options(option?: any) {
return this._fb.group({
id: [option?.id ?? `${this.id}-${this.options.length + 1}`],
message: [option?.message ?? ''],
value: [option?.value ?? ''],
});
}

setCMI5BlockOptions() {
this.CMI5BlockOptions = [
{
message: this._translate.translate(
'PAGE-CONTENT.BLOCK.BUTTONS.JUMP-BLOCK.SUCCESS'
),
value: 'success',
},
{
message: this._translate.translate(
'PAGE-CONTENT.BLOCK.BUTTONS.JUMP-BLOCK.FAILED'
),
value: 'failed',
},
];
this.CMI5BlockOptions.forEach((option) => {
this.options.push(this.addCMI5Options(option));
});
}

async processDocs(event: any) {
const allowedFileTypes = ['application/zip'];

if (!allowedFileTypes.includes(event.target.files[0].type)) {
this._cmi5UploadService.openErrorModal(
'Invalid File Type',
'Please select a .zip only.'
);
return;
}

if (event.target.files[0]) {
this.file = event.target.files[0];
this.isDocLoading = true;

//step 1 create the file path that will be in firebase storage
const fileName = this.file.name; // Get the uploaded file name
const CMI5FilePath = ` orgs/${this.id}/course_packages/${this.id}/${fileName}`;
const response = await this._cmi5UploadService.uploadSingleFile(
this.file,
CMI5FilePath
);
this._sBs.sink = response
.pipe(take(1))
.subscribe((url) => this._autofillUrl(url));
} else {
this.docLink = this.defaultLink;
}
}
private _autofillUrl(url: string) {
// Extract the file name from the URL
this.CMI5BlockForm.patchValue({ fileSrc: url });

this.isDocLoading = false;
}

ngOnDestroy(): void {
this._sBs.unsubscribe();
}
}


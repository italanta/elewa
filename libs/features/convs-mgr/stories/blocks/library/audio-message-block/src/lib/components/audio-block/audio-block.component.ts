import {  UploadFileService } from '@app/state/file';
import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

import { Logger } from '@iote/bricks-angular';
import { BrowserJsPlumbInstance } from '@jsplumb/browser-ui';

import { _JsPlumbComponentDecorator } from '@app/features/convs-mgr/stories/blocks/library/block-options';

import { VoiceMessageBlock } from '@app/model/convs-mgr/stories/blocks/messaging';


@Component({
  selector: 'app-audio-block',
  templateUrl: './audio-block.component.html',
  styleUrls: ['./audio-block.component.scss'],
})
export class AudioBlockComponent implements OnInit {


@Input() id: string;
@Input() block: VoiceMessageBlock;
@Input()audioMessageForm: FormGroup;
@Input() jsPlumb: BrowserJsPlumbInstance;

file: File;
audioLink: string = "";
audioInputId: string;
defaultImage: string ="assets/images/lib/block-builder/audio-block-placeholder.png"
isLoadingAudio: boolean;


constructor(private _fb: FormBuilder,
            private _logger: Logger,
            private _audioUploadService: UploadFileService) { }

ngOnInit(): void {
  this.audioInputId = `aud-${this.id}`
}

ngAfterViewInit(): void {
  if (this.jsPlumb) {
    this._decorateInput();
  }
}

async processAudio(event: any) 
{
  if (event.target.files && event.target.files[0]) {
    const reader = new FileReader();
    reader.onload = (e: any) => this.audioLink = e.target.result;
    reader.readAsDataURL(event.target.files[0]);
    this.file = event.target.files[0];
    this.isLoadingAudio = true;
  } else {
    this.audioLink  = this.defaultImage;
  }
  this.isLoadingAudio = true;
  //Step 1 - Create the file path that will be in firebase storage
  const audioFilePath = `audios/${this.file.name}_${new Date().getTime()}`;
  (await this._audioUploadService.uploadFile(this.file, this.block, audioFilePath)).subscribe();

}


private _decorateInput() {
  let input = document.getElementById(this.audioInputId) as Element;
  if (this.jsPlumb) {
    input = _JsPlumbComponentDecorator(input, this.jsPlumb);
  }
}

}

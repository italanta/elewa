import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { BrowserJsPlumbInstance } from '@jsplumb/browser-ui';

import { VideoMessageBlock } from '@app/model/convs-mgr/stories/blocks/messaging';
import { StoryBlockTypes } from '@app/model/convs-mgr/stories/blocks/main';

import { UploadFileService } from '@app/state/file';

import { _JsPlumbComponentDecorator } from '@app/features/convs-mgr/stories/blocks/library/block-options';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-video-block',
  templateUrl: './video-block.component.html',
  styleUrls: ['./video-block.component.scss'],
})

export class VideoBlockComponent implements OnInit {

  @Input() id: string;
  @Input() block: VideoMessageBlock;
  @Input() videoMessageForm: FormGroup;
  @Input() jsPlumb: BrowserJsPlumbInstance;
  

  type: StoryBlockTypes;
  videoType = StoryBlockTypes.Video;

  blockFormGroup: FormGroup;

  file: File;
  videoInputId: string;
  isLoadingVideo: boolean;
  hasVideo: boolean;
  videoUrl: any;

  videoInputUpload: string = '';
  videoId: any;

  constructor(private _videoUploadService: UploadFileService,
    public domSanitizer: DomSanitizer
  ) 
  {
    this.block = this.block as VideoMessageBlock;
  }

  ngOnInit(): void {
    this.videoInputId = `vid-${this.id}`;
    this.videoInputUpload = `vid-${this.id}-upload`;
    
    this.checkIfVideoExists();
  }

  checkIfVideoExists(){
    this.videoUrl = this.videoMessageForm.value.fileSrc;
    this.hasVideo = this.videoUrl && this.videoUrl != '' ? true : false;
  }

  async processVideo(event: any) {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e: any) => this.videoUrl = e.target.result;
      reader.readAsDataURL(event.target.files[0]);
      this.file = event.target.files[0];
      this.isLoadingVideo = true;
    }
    //Step 1 - Create the file path that will be in firebase storage
    const vidFilePath = `videos/${this.file.name}_${new Date().getTime()}`;
    this.isLoadingVideo = true;
    this.videoMessageForm.get('fileName')?.setValue(this.file.name);

    (await this._videoUploadService.uploadFile(this.file, this.block, vidFilePath)).subscribe();
    this.isLoadingVideo = false;
  }  
}

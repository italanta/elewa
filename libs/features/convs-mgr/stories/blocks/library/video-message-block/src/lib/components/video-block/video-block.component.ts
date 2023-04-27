import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';

import { SubSink } from 'subsink';
import { BrowserJsPlumbInstance } from '@jsplumb/browser-ui';

import { FileStorageService } from '@app/state/file';

import { VideoMessageBlock } from '@app/model/convs-mgr/stories/blocks/messaging';
import { StoryBlockTypes } from '@app/model/convs-mgr/stories/blocks/main';



@Component({
  selector: 'app-video-block',
  templateUrl: './video-block.component.html',
  styleUrls: ['./video-block.component.scss'],
})

export class VideoBlockComponent implements OnInit, OnDestroy {

  @Input() id: string;
  @Input() block: VideoMessageBlock;
  @Input() videoMessageForm: FormGroup;
  @Input() jsPlumb: BrowserJsPlumbInstance;
  
  private _sBs = new SubSink()

  type: StoryBlockTypes;
  videoType = StoryBlockTypes.Video;

  blockFormGroup: FormGroup;

  file: File;
  videoInputId: string;
  isLoadingVideo: boolean;
  hasVideo: boolean;
  videoUrl: string;

  videoInputUpload = '';
  videoId: string;
  videoLink: string;

  constructor(private _videoUploadService: FileStorageService) 
  {
    this.block = this.block as VideoMessageBlock;
  }

  ngOnInit(): void {
    this.videoInputId = `vid-${this.id}`;
    this.videoInputUpload = `vid-${this.id}-upload`;
    this.checkIfVideoExists();
  }

  checkIfVideoExists(){
    if (this.videoMessageForm) {
      this.videoUrl = this.videoMessageForm.value.fileSrc;
      this.hasVideo = this.videoUrl && this.videoUrl != '' ? true : false;
    }
  }
  
  async processVideo(event: any) {

    const allowedFileTypes = ['video/mp4'];

    if (!allowedFileTypes.includes(event.target.files[0].type)) {
      this._videoUploadService.openErrorModal("Invalid File Type", "Please select a .mp4 only.");
      return;
    }

    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e: any) => this.videoLink = e.target.result;
      reader.readAsDataURL(event.target.files[0]);
      this.file = event.target.files[0];

      this.videoMessageForm.patchValue({ fileName: this.file.name });
      this.isLoadingVideo = true;

      //Step 1 - Create the file path that will be in firebase storage
      const vidFilePath = `videos/${this.file.name}_${new Date().getTime()}`;
      this.videoMessageForm.get('fileName')?.setValue(this.file.name);

      const response = await this._videoUploadService.uploadSingleFile(this.file, vidFilePath)
      this._sBs.sink = response.subscribe(url => this._autofillVideoUrl(url))
    }
  }

  private _autofillVideoUrl(url: any) {
    this.videoMessageForm.patchValue({ fileSrc: url });
    this.isLoadingVideo = false;
  }

  ngOnDestroy(){
    this._sBs.unsubscribe()
  }
}

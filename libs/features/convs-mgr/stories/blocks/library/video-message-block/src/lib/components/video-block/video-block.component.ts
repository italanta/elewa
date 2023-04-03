import { Component, Input} from '@angular/core';
import { FormGroup } from '@angular/forms';

import { BrowserJsPlumbInstance } from '@jsplumb/browser-ui';

import { VideoMessageBlock } from '@app/model/convs-mgr/stories/blocks/messaging';
import { StoryBlockTypes } from '@app/model/convs-mgr/stories/blocks/main';


import { _JsPlumbComponentDecorator } from '@app/features/convs-mgr/stories/blocks/library/block-options';

import { VideoBlockModalComponent } from '../../modals/video-block-modal/video-block-modal.component';
import { MatDialog} from '@angular/material/dialog';
import { UploadFileService } from '@app/state/file';
import { AngularFireStorage } from '@angular/fire/compat/storage';

@Component({
  selector: 'app-video-block',
  templateUrl: './video-block.component.html',
  styleUrls: ['./video-block.component.scss'],
})

export class VideoBlockComponent{

  @Input() id: string;
  @Input() block: VideoMessageBlock;
  @Input() videoMessageForm: FormGroup;
  @Input() jsPlumb: BrowserJsPlumbInstance;

  file: File;
  videoLink: string = "";
  videoInputId: string;
  isLoadingVideo: boolean;
  hasVideo: boolean;
  videoUrl: string;

  videoInputUpload: string = '';

  constructor(
              private matdialog:MatDialog,
              //private dialogueRef: MatDialogRef
              private _videoUploadService: UploadFileService,
              private _ngfiStorage:AngularFireStorage
  ) {
    this.block = this.block as VideoMessageBlock;
  }
  
  ngOnIni(): void {
    this.videoInputId = `vid-${this.id}`;
    this.videoInputUpload = `vid-${this.id}-upload`;

    if (this.block && this.block.fileSrc) {
      this.videoUrl = this.block.fileSrc;
      this.hasVideo = true;
    } else {
      this.checkIfVideoExists();
    }
  }

  checkIfVideoExists() {
    this.videoUrl = this.videoMessageForm.value.fileSrc;
    this.hasVideo = this.videoUrl && this.videoUrl != '' ? true : false;
  }

  openVideoModal(){
   const dialogRef = this.matdialog.open(VideoBlockModalComponent, {minWidth: '1000px',
    data: {
      id: this.id,
      block: this.block,
      videoMessageForm: this.videoMessageForm,
      //jsPlumb: this.jsPlumb
    }
  })
  // dialogRef.componentInstance.applied.subscribe((videoBlock: any) => {
  //   this.block = { ...this.block, ...videoBlock };
  // }); 
  }

  async processVideo(event: any) {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e: any) => this.videoLink = e.target.result;
      reader.readAsDataURL(event.target.files[0]);
      this.file = event.target.files[0];
      this.isLoadingVideo = true;
    }
    //Step 1 - Create the file path that will be in firebase storage
    const vidFilePath = `videos/${this.file.name}_${new Date().getTime()}`;
    this.isLoadingVideo = true;
    this.videoMessageForm.get('fileName')?.setValue(this.file.name);

    this.videoUrl =await (await this._ngfiStorage.upload(vidFilePath, this.file)).ref.getDownloadURL();
    (await this._videoUploadService.uploadFile(this.file, this.block, vidFilePath)).subscribe();
  }
}
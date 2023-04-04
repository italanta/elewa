import { Component, Input,OnInit} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

import { AngularFireStorage } from '@angular/fire/compat/storage';

import { BrowserJsPlumbInstance } from '@jsplumb/browser-ui';

import { VideoMessageBlock } from '@app/model/convs-mgr/stories/blocks/messaging';
import { UploadFileService } from '@app/state/file';

import { _JsPlumbComponentDecorator } from '@app/features/convs-mgr/stories/blocks/library/block-options';



@Component({
  selector: 'app-video-block-modal',
  templateUrl: './video-block-modal.component.html',
  styleUrls: ['./video-block-modal.component.scss']
})
export class VideoBlockModalComponent implements OnInit{

  @Input() id: string;
  @Input() block: VideoMessageBlock;
  @Input() videoMessageForm: FormGroup;
  @Input() jsPlumb: BrowserJsPlumbInstance;

  blockFormGroup: FormGroup;

  file: File;
  videoLink: string = "";
  videoInputId: string;
  isLoadingVideo: boolean;
  hasVideo: boolean;
  videoUrl: string;

  videoInputUpload: string = '';

  title = 'Upload Video';
  sizeOptions = [
  { vidSize: '4K', resolution: '3840px x 2160px' },
  { vidSize: '1080p', resolution: '1920px x 1080px' },
  { vidSize: '720p (Recommended)', resolution: '1280px x 720px' },
  { vidSize: '540p', resolution: '960px x 540px' },
  { vidSize: "Don't Encode Media", resolution: 'This will use the original media you provided' },
  ]

  constructor(
    private _videoUploadService: UploadFileService,
    private dialogueRef: MatDialogRef<VideoBlockModalComponent>,
    private _ngfiStorage:AngularFireStorage
  ) { }

  ngOnInit(): void {
    this.videoInputId = `vid-${this.id}`;
    this.videoInputUpload = `vid-${this.id}-upload`;
    
    this.checkIfVideoExists();
  }

  checkIfVideoExists(){
    this.videoUrl = this.videoMessageForm.value.fileSrc;
    this.hasVideo = this.videoUrl && this.videoUrl != '' ? true : false;
  }

  apply() {
    this.closeModal()
  }

  closeModal(): void {
    this.dialogueRef.close();
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
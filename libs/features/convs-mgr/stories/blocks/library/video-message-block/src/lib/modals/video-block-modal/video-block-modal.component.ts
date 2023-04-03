import { Component, Input, Output, EventEmitter} from '@angular/core';
import { FormGroup } from '@angular/forms';

import { BrowserJsPlumbInstance } from '@jsplumb/browser-ui';

import { VideoMessageBlock } from '@app/model/convs-mgr/stories/blocks/messaging';
import { StoryBlockTypes } from '@app/model/convs-mgr/stories/blocks/main';

import { UploadFileService } from '@app/state/file';

import { _JsPlumbComponentDecorator } from '@app/features/convs-mgr/stories/blocks/library/block-options';
import { MatDialogRef } from '@angular/material/dialog';
import { AngularFireStorage } from '@angular/fire/compat/storage';

@Component({
  selector: 'app-video-block-modal',
  templateUrl: './video-block-modal.component.html',
  styleUrls: ['./video-block-modal.component.scss']
})
export class VideoBlockModalComponent{

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
  videoInputUpload: string = '';

  videoUrl: string;
  videoFile: string
  videoLink: string = "";

  // @Output() applied = new EventEmitter<any>();
  // name: string
  // size: string
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
  ) {
    this.block = this.block as VideoMessageBlock;
  }

   @Output() videoSelected = new EventEmitter<File>();
   
  //@Output() applyClicked = new EventEmitter<{ video: File, name: string, size: string }>();

  apply() {
    console.log(this.videoSelected)
    this.videoSelected.emit(this.file);
    this.closeModal()
  }

  // apply(){
  //   const video = this.file;
  //   const name = this.videoMessageForm.get('fileName')?.value;
  //   const size = this.videoMessageForm.get('fileSize')?.value;
  //   this.applyClicked.emit({ video, name, size });
  // }

  closeModal(): void {
    this.dialogueRef.close();
  }

  openFileManager() {
    // document.getElementById(this.videoInputUpload).click();
    const fileInput = document.getElementById('file-input') as HTMLInputElement;
    fileInput.click();
  }

   onVideoSelected(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length) {
      const file = target.files[0];
      const url = URL.createObjectURL(file);
      this.videoUrl = url;
      this.block.fileSrc = url;
      this.block.fileName = file.name; // set the fileName property of the VideoMessageBlock to the name of the selected file
      this.hasVideo = true;
    }
  }
}

/*
  apply(): void {
  // Pass the required data to the parent component using an event emitter
  this.applyClicked.emit({
    video: this.videoFile,
    name: this.block.name,
    size: this.block.size
  });
}
*/

/*
  @Input() formGroup: FormGroup;
  @Input() instance: BrowserJsPlumbInstance;
  @Input() block: VideoMessageBlock;
  @Input() dialogRef: MatDialogRef<any>;

  sizeOptions = [
    { vidSize: '240p', resolution: '426 x 240' },
    { vidSize: '360p', resolution: '640 x 360' },
    { vidSize: '480p', resolution: '854 x 480' },
    { vidSize: '720p', resolution: '1280 x 720' },
    { vidSize: '1080p', resolution: '1920 x 1080' },
  ];

  videoUrl: string = '';
  hasVideo: boolean = false;
  videoInputId = 'video-input-id';
  videoInputUpload = 'video-input-upload';

  constructor(private uploadFileService: UploadFileService) {}

  ngOnInit() {
    if (this.block.fileSrc) {
      this.videoUrl = this.block.fileSrc;
      this.hasVideo = true;
    }
  }

  openFileManager() {
    document.getElementById(this.videoInputUpload).click();
  }

  onVideoSelected(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length) {
      const file = target.files[0];
      const url = URL.createObjectURL(file);
      this.videoUrl = url;
      this.block.fileSrc = url;
      this.block.fileName = file.name; // set the fileName property of the VideoMessageBlock to the name of the selected file
      this.hasVideo = true;
    }
  }

  apply() {
    this.dialogRef.close({ block: this.block });
  }

  closeModal() {
    this.dialogRef.close();
  }
*/
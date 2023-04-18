import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AngularFireStorage } from '@angular/fire/compat/storage';

import { BrowserJsPlumbInstance } from '@jsplumb/browser-ui';

import { VideoMessageBlock } from '@app/model/convs-mgr/stories/blocks/messaging';
import { StoryBlockTypes } from '@app/model/convs-mgr/stories/blocks/main';

import { UploadFileService, FileStorageService } from '@app/state/file';

import { _JsPlumbComponentDecorator } from '@app/features/convs-mgr/stories/blocks/library/block-options';
import { catchError, of } from 'rxjs';
import { SubSink } from 'subsink';

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

  type: StoryBlockTypes;
  videoType = StoryBlockTypes.Video;

  blockFormGroup: FormGroup;

  file: File;
  videoLink: string = "";
  videoInputId: string;
  isLoadingVideo: boolean;
  hasVideo: boolean;
  videoUrl: string;

  videoInputUpload: string = '';

  private _sBs = new SubSink();  //SubSink instance

  constructor(private _videoUploadService: UploadFileService,
              private _ngfiStorage:AngularFireStorage,
              private _fileStorageService: FileStorageService
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

    const allowedFileTypes = ['video/mp4'];

    if (!allowedFileTypes.includes(event.target.files[0].type)) {
      //error modal displayed here
      this._fileStorageService.openErrorModal("Invalid File Type", "Please select a .mp4 only.");
      event.target.value = '' //clear input
       return;
    }



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
    
    this._sBs.sink = (await this._videoUploadService.uploadFile(this.file, this.block, vidFilePath)).pipe(
      catchError(error => {
        console.error('Error uploading file:', error);
        this._fileStorageService.openErrorModal("Error occurred", "Try again later.");
        event.target.value = '' //clear input
        return of(null);
      })
    ).subscribe(() => {
      this.isLoadingVideo = false;
    });
  }

  ngOnDestroy(): void {
    this._sBs.unsubscribe(); // unsubscribe from all subscriptions
  }
}
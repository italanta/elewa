import { Component, Inject, OnInit} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { UploadFileService } from '@app/state/file';
import { FileStorageService } from '@app/state/file';

import { Story } from '@app/model/convs-mgr/stories/main';



@Component({
  selector: 'app-video-block-modal',
  templateUrl: './video-block-modal.component.html',
  styleUrls: ['./video-block-modal.component.scss']
})
export class VideoBlockModalComponent implements OnInit{

  blockFormGroup: FormGroup;
  //public formData: any;


  file: File;
  videoLink:"";
  videoInputId: string;
  isLoadingVideo: boolean;
  hasVideo: boolean;
  videoUrl: string;
  vidFilePath: string

  videoInputUpload = '';

  title = 'Upload Video';
  sizeOptions = [
  { vidSize: '4K', resolution: '3840px x 2160px' },
  { vidSize: '1080p', resolution: '1920px x 1080px' },
  { vidSize: '720p (Recommended)', resolution: '1280px x 720px' },
  { vidSize: '540p', resolution: '960px x 540px' },
  { vidSize: "Don't Encode Media", resolution: 'This will use the original media you provided' },
  ]

  constructor(
    private _videoUploadService: FileStorageService,
    private dialogRef: MatDialogRef<VideoBlockModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { videoMessageForm: FormGroup, block: Story },
  ) { }

  ngOnInit(): void {
    this.videoInputId = `vid-${this.data.block.id}`;
    this.videoInputUpload = `vid-${this.data.block.id}-upload`;
    
    this.checkIfVideoExists();
  }

  checkIfVideoExists(){
    this.videoUrl = this.data.videoMessageForm.value.fileSrc;
    this.hasVideo = this.videoUrl && this.videoUrl != '' ? true : false;
  }

   async apply() {
    if(this.vidFilePath){
      const res = await this._videoUploadService.uploadSingleFile(this.file, this.vidFilePath);
      res.subscribe(url => this._autofillUrl(url))
    } else {
      alert('not uploaded')
    }
  
    this.closeModal()
  }

  closeModal(): void {
    this.dialogRef.close();
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
    this.vidFilePath = `videos/${this.file.name}_${new Date().getTime()}`;
    this.isLoadingVideo = true;
    this.data.videoMessageForm.get('fileName')?.setValue(this.file.name);
  }

  private _autofillUrl(url: string) {
    debugger
    this.data.videoMessageForm.patchValue({fileSrc: url});
  }
}
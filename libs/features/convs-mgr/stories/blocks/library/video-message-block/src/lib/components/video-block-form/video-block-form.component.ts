import { Component, OnInit, Input, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

import { SubSink } from 'subsink';

import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

import { BrowserJsPlumbInstance } from '@jsplumb/browser-ui';

import { VideoMessageBlock } from '@app/model/convs-mgr/stories/blocks/messaging';
import { FileStorageService } from '@app/state/file';

@Component({
  selector: 'app-video-block-form',
  templateUrl: './video-block-form.component.html',
  styleUrl: './video-block-form.component.scss',
})
export class VideoBlockFormComponent implements OnInit, OnDestroy  {
  @Input() id: string;
  @Input() block: VideoMessageBlock;
  @Input() videoMessageForm: FormGroup;
  @Input() jsPlumb: BrowserJsPlumbInstance;
  @Input() isEdit: boolean;

  @ViewChild('video') video: ElementRef<HTMLVideoElement>;

  private _sBs = new SubSink();
  videoLink: string;
  videoInputId: string;

  isUploading: boolean;
  byPassedLimits: any[] = [];
  whatsappLimit: boolean;
  messengerLimit: boolean;
  hasVideo = false;
  isLoading$: Observable<Map<string, boolean>>;
  videoName: string;

  file: File;

  constructor(private _videoUploadService: FileStorageService) {}
  
  ngOnInit(): void {
    this.videoInputId = `img-${this.id}`;
    this.checkIfVideoExists();
    this.isLoading$ = this._videoUploadService.isLoading$;
    const fileSize = this.videoMessageForm.get('fileSize')?.value;

    this.videoName = this.videoMessageForm.get('message')?.value || this.videoMessageForm.get('fileName')?.value || "";
  
    if (fileSize) {
      this._checkSizeLimit(fileSize);
    }
  }

  checkIfVideoExists() {
    if (this.videoMessageForm) {
      this.video?.nativeElement.load();

      this.videoLink = this.videoMessageForm.value.fileSrc;
      this.hasVideo = !this.videoLink ? false : true;
    }
  }

  /** Step 3 Check if file bypasses size limit. */
  private _checkSizeLimit(size:number) {
    this.byPassedLimits = this._videoUploadService.checkFileSizeLimits(size, 'video');

    if (this.byPassedLimits.find(limit => limit.platform === "WhatsApp")) this.whatsappLimit = true;
    else if (this.byPassedLimits.find(limit => limit.platform === "messenger")) this.messengerLimit = true;
  }


  async processVideo(event: any) {   
    const allowedFileTypes = ['video/mp4']
    this.file = event.target.files[0]

    if (!allowedFileTypes.includes(event.target.files[0].type)) {
      this._videoUploadService.openErrorModal("Invalid File Type", "Please select an video file (.mp4) only.");
      return;
    }

    if (this.file) {
      this._videoUploadService.setIsLoading(this.id, true);
      this.hasVideo = true;

      //Step 1 - Create the file path that will be in firebase storage
      const imgFilePath = `videos/${this.file.name}`;

      //Step 2 - Upload file to firestore
      const response = await this._videoUploadService.uploadSingleFile(this.file, imgFilePath);

      const fileSizeInKB = this.file.size / 1024;

      this.videoMessageForm.patchValue({fileName: this.file.name});

      this.videoName = this.videoMessageForm.get('message')?.value || this.file.name;

      //Step 3 - PatchValue to Block
      this._sBs.sink = response.pipe(take(1)).subscribe((url) => this._autofillUrl(url, fileSizeInKB));
    }
  }

  private _autofillUrl(url: string, fileSizeInKB: number) {
    this.videoMessageForm.patchValue({ fileSrc: url, fileSize: fileSizeInKB });
    this._videoUploadService.setIsLoading(this.id, false);
    this.checkIfVideoExists();
    this._checkSizeLimit(fileSizeInKB);
  }

  ngOnDestroy() {
    this._sBs.unsubscribe()
  }
}

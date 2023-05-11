import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

import { BrowserJsPlumbInstance } from '@jsplumb/browser-ui';

import { FileStorageService } from '@app/state/file';

import { VideoMessageBlock } from '@app/model/convs-mgr/stories/blocks/messaging';
import { StoryBlockTypes } from '@app/model/convs-mgr/stories/blocks/main';

import { VideoUploadModalComponent } from '../../modals/video-upload-modal/video-upload-modal.component';

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
  videoInputUpload: string;
  videoLink: string;

  file: File;
  videoInputId: string;
  isLoadingVideo: boolean;
  hasVideo: boolean;
  videoUrl: string;
  videoId: string;

  constructor(
    private _videoUploadService: FileStorageService,
    private matdialog: MatDialog
  ) {
    this.block = this.block as VideoMessageBlock;
  }

  ngOnInit(): void {
    this.videoInputId = `vid-${this.id}`;
    this.videoInputUpload = `vid-${this.id}-upload`;
    this.checkIfVideoExists();
  }

  checkIfVideoExists() {
    if (this.videoMessageForm) {
      this.videoUrl = this.videoMessageForm.value.fileSrc;
      this.hasVideo = this.videoUrl != '' ? true : false;
    }
  }

  openVideoUploadModal() {
    this.matdialog.open(VideoUploadModalComponent, {
      //width: '900px',
      data: { videoMessageForm: this.videoMessageForm },
    });
  }
}

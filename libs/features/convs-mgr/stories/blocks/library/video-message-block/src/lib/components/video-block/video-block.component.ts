import { Component, OnInit, Input, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

import { SubSink } from 'subsink';
import { BrowserJsPlumbInstance } from '@jsplumb/browser-ui';

import { VideoMessageBlock } from '@app/model/convs-mgr/stories/blocks/messaging';

import { VideoUploadModalComponent } from '../../modals/video-upload-modal/video-upload-modal.component';
import { ICONS_AND_TITLES } from '@app/features/convs-mgr/stories/blocks/library/main';

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

  svgIcon = ""
  faIcon = ""

  @ViewChild('video') video: ElementRef<HTMLVideoElement>;

  private _sBs = new SubSink();
  isLoadingVideo: boolean;
  videoUrl: string;

  
  constructor(private matdialog: MatDialog) {}
  
  ngOnInit(): void {
    this.checkIfVideoExists();
    this.svgIcon = ICONS_AND_TITLES[13].svgIcon
    this.faIcon = ICONS_AND_TITLES[13].icon
  }

  checkIfVideoExists() {
    if (this.videoMessageForm) {
      this.videoUrl = this.videoMessageForm.value.fileSrc;
      this.video?.nativeElement.load();
      this.video?.nativeElement.play();
    }
  }

  openVideoUploadModal() {
    const dialogRef = this.matdialog.open(VideoUploadModalComponent, {
      data: { videoMessageForm: this.videoMessageForm },
    });

    this._sBs.sink = dialogRef.afterClosed().subscribe(() => this.checkIfVideoExists())
  }

  ngOnDestroy() {
    this._sBs.unsubscribe()
  }
}

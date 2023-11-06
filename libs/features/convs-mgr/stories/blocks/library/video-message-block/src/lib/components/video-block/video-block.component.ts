import { Component, OnInit, Input, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

import { SubSink } from 'subsink';
import { BrowserJsPlumbInstance } from '@jsplumb/browser-ui';

import { VideoMessageBlock } from '@app/model/convs-mgr/stories/blocks/messaging';

import { VideoUploadModalComponent } from '../../modals/video-upload-modal/video-upload-modal.component';

import {ICONS_AND_TITLES} from '../../../../../main/src/lib/assets/icons-and-titles'
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

  @ViewChild('video') video: ElementRef<HTMLVideoElement>;

  /**creating a placeholder  that will be used or assigned  an SVG icon*/
  svgIcon = ""

  private _sBs = new SubSink();
  isLoadingVideo: boolean;
  videoUrl: string;

  
  constructor(private matdialog: MatDialog) {}
  
  ngOnInit(): void {
    this.checkIfVideoExists();

    /** Assign the SVG icon based on the 'block.type' to 'svgIcon'.*/
    this.svgIcon = this.getBlockIconAndTitle(this.block.type).svgIcon;
  }
  
  /**Get icon and title information based on 'type'. */
  getBlockIconAndTitle(type:number) {
    return ICONS_AND_TITLES[type];
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

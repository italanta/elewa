import { Component, Input, OnInit} from '@angular/core';
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

export class VideoBlockComponent implements OnInit{

  @Input() id: string;
  @Input() block: VideoMessageBlock;
  @Input() videoMessageForm: FormGroup;
  @Input() jsPlumb: BrowserJsPlumbInstance;

  type: StoryBlockTypes;
  videoType = StoryBlockTypes.Video;
  videoInputUpload: string
  videoLink: string

  file: File;

  constructor(
              private matdialog:MatDialog,
              //private dialogueRef: MatDialogRef
  ) {
    this.block = this.block as VideoMessageBlock;
  }
  
  ngOnInit(): void {
    this.videoLink = this.videoMessageForm.value.fileSrc
   }

  
  openVideoModal(){
   this.matdialog.open(VideoBlockModalComponent, {minWidth: '1000px',
    data: {
      block: this.block,
      videoMessageForm: this.videoMessageForm,
      }
    })
  }
}
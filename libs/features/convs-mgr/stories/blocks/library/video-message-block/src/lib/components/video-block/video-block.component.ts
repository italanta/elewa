import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

import { Logger } from '@iote/bricks-angular';
import { BrowserJsPlumbInstance } from '@jsplumb/browser-ui';

import { _JsPlumbComponentDecorator } from '@app/features/convs-mgr/stories/blocks/library/block-options';

import { VideoMessageBlock } from '@app/model/convs-mgr/stories/blocks/messaging';

import { StoryBlocksStore } from '@app/state/convs-mgr/stories/blocks'
import { UploadFileService } from '@app/state/file';



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

  file: File;
  videoLink: string = "";
  videoInputId: string;
  isLoadingVideo: boolean;


  constructor(private _videoUploadService: UploadFileService,
    private _logger: Logger,
    private _storyBlockService: StoryBlocksStore) { }

  ngOnInit(): void {
    this.videoInputId = `vid-${this.id}`;
  }

  ngAfterViewInit(): void {
    if (this.jsPlumb) {
      this._decorateInput();
    }
  }

  async processVideo(event: any) 
  {
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

    (await this._videoUploadService.uploadFile(this.file, this.block,vidFilePath)).subscribe();

  }


  changeVideo(){

    const newBlock: VideoMessageBlock = {
      ...this.block as VideoMessageBlock,
      fileSrc: '',
      fileName: ''
    }
    this._storyBlockService.update(newBlock).subscribe();
    }


  private _decorateInput() {
    let input = document.getElementById(this.videoInputId) as Element;
    if (this.jsPlumb) {
      input = _JsPlumbComponentDecorator(input, this.jsPlumb);
    }
  }
}
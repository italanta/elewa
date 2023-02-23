import { AfterViewInit, Component, ElementRef, Output, EventEmitter, ViewChild, ViewContainerRef } from '@angular/core';
import { StoryEditorFrame } from '../../model/story-editor-frame.model';  

import { StoryEditorInitialiserService } from '../../providers/story-editor-initialiser.service';

@Component({
  selector: 'convl-story-editor-frame',
  templateUrl: './editor-frame.component.html',
  styleUrls: ['./editor-frame.component.scss']
})
export class StoryEditorFrameComponent implements AfterViewInit //implements OnDestroy
{
  @ViewChild('editor') editorVC: ElementRef<HTMLElement>;
  @ViewChild('viewport', { read: ViewContainerRef, static: true }) viewport: ViewContainerRef;

  @Output() frameLoaded = new EventEmitter<StoryEditorFrame>;

  constructor(private _frameInitialiser: StoryEditorInitialiserService) { }


  ngAfterViewInit() {
    const frame = this._frameInitialiser.initialiseEditor(this.editorVC, this.viewport);

    this.frameLoaded.emit(frame);
  }

  onScroll(event: any): void {
    console.log(event)
  }

}

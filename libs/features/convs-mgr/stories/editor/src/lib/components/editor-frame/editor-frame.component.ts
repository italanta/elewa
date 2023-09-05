import { AfterViewInit, Component, ElementRef, Output, EventEmitter, ViewChild, ViewContainerRef } from '@angular/core';
import { StoryEditorFrame } from '../../model/story-editor-frame.model';  

import { StoryEditorInitialiserService } from '../../providers/story-editor-initialiser.service';
import { SubSink } from 'subsink';
import { EditorFrameLoadingService } from '../../providers/editor-frame-spinner.service';

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
  @Output()pinchZoom = new EventEmitter<number>()
  private _sb = new SubSink();
  showEditorSpinner: boolean

  constructor(private _frameInitialiser: StoryEditorInitialiserService, private _editorLoading: EditorFrameLoadingService) { }


  ngAfterViewInit() {
    this._sb.sink = this._editorLoading.loaded$.subscribe((loading) => {
      this.showEditorSpinner = loading;
    });
    const frame = this._frameInitialiser.initialiseEditor(this.editorVC, this.viewport);

    this.frameLoaded.emit(frame);
  }


  onScroll(): void { }

  onPinch(level:number){
    this.pinchZoom.emit(level)
  }
}

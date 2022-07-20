import { BrowserJsPlumbInstance, newInstance as initJsPlumb } from '@jsplumb/browser-ui';
import { AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';

@Component({
  selector: 'convl-story-editor-frame',
  templateUrl: './editor-frame.component.html',
  styleUrls: ['./editor-frame.component.scss']
})
export class StoryEditorFrameComponent implements AfterViewInit //implements OnDestroy
{
  @ViewChild('editor') editorVC: ElementRef;

  private _jsplumb: BrowserJsPlumbInstance;

  constructor(private _renderer: Renderer2) 
  { }

  ngAfterViewInit() {
    this._jsplumb = initJsPlumb({
      container: this.editorVC.nativeElement
    });
    
  }
  

}

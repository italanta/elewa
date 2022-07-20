import { BrowserJsPlumbInstance, newInstance as initJsPlumb } from '@jsplumb/browser-ui';
import { AfterViewInit, Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { StoryEditorInitialiserService } from '@app/features/convs-mgr/stories/blocks/main';

@Component({
  selector: 'convl-story-editor-frame',
  templateUrl: './editor-frame.component.html',
  styleUrls: ['./editor-frame.component.scss']
})
export class StoryEditorFrameComponent implements AfterViewInit //implements OnDestroy
{
  @ViewChild('editor') editorVC: ElementRef;

  private _jsplumb: BrowserJsPlumbInstance;

  constructor(private _renderer: Renderer2,
              private _frameInitialiser: StoryEditorInitialiserService) 
  { }

  ngAfterViewInit() {
    const frame = this._frameInitialiser.initialiseEditor(this._renderer, this.editorVC);

    frame.draw();
  }
  

}

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
  @ViewChild('block1') block1: ElementRef<HTMLInputElement>;
  @ViewChild('block2') block2: ElementRef<HTMLInputElement>;
  @ViewChild('block3') block3: ElementRef<HTMLInputElement>;

  private _jsplumb: BrowserJsPlumbInstance;

  constructor(private _renderer: Renderer2,
              private _frameInitialiser: StoryEditorInitialiserService) 
  { }

  ngAfterViewInit() {
    // const frame = this._frameInitialiser.initialiseEditor(this._renderer, this.editorVC);

    // frame.draw();
    
    this._jsplumb = initJsPlumb({
      container: this.editorVC.nativeElement
    });
    // start playing
    this._jsplumb.addEndpoint(this.block1.nativeElement, {
      endpoint: 'Dot',
      anchor: "Right",
      source: true,


    });
    this._jsplumb.addEndpoint(this.block2.nativeElement, {
      endpoint: 'Rectangle',
      anchor: "Top",
      target: true,
    });

    this._jsplumb.addEndpoint(this.block3.nativeElement, {
      endpoint: 'Rectangle',
      anchor: "Left",
      target: true,

    });
  }
  

}

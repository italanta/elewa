import { Component, ElementRef, Input, OnDestroy, OnInit } from '@angular/core';

import { SubSink } from 'subsink';
import { Observable, debounceTime } from 'rxjs'; //interval
// import html2canvas from 'dom-to-image';

import { StoryEditorState } from '@app/state/convs-mgr/story-editor';
import { MINI_MAP_FACTOR } from '../../utils/frame-size';

@Component({
  selector: 'convl-story-editor-minimap',
  templateUrl: './minimap.component.html',
  styleUrls: ['./minimap.component.scss']
})
export class StoryEditorMiniMapComponent implements OnInit, OnDestroy
{
  private _sBs = new SubSink();

  @Input() editorContainer: ElementRef<HTMLElement>;

  @Input() frameState$    : Observable<StoryEditorState>;
  @Input() viewport$      : Observable<DOMRect>;
  @Input() zoomFactor     = 1;

  blocks: DOMRect[];
  
  /** Base64 encoded background image */
  backgroundImg: string;

  /** Representation of the viewport within the larger editor frame */
  viewport: DOMRect;

  ngOnInit() 
  {
    // Whenever the frame changes, take a screenshot of the frame div 
    //    which acts as background image of the minimap.
    // @see https://javascript.plainenglish.io/how-to-take-a-screenshot-of-a-div-with-javascript-641576de0f74
    // The above has strong performance issues.

    // -- Alternative approach, draw boxes for each block.
    // TODO: Now all minimap-blocks have same dimensions. 
    //       Possible optimalisation is to look at block type and draw approximate dimensions based on type.
    //          Or different colour per block type.
    this._sBs.sink =
      this.frameState$.subscribe(async (state) => 
      {
        this.blocks = state.blocks.map(block => ({
          x: block.position.x/MINI_MAP_FACTOR,
          y: block.position.y/MINI_MAP_FACTOR,
  
          width:  250/MINI_MAP_FACTOR,
          height: 200/MINI_MAP_FACTOR
        }) as DOMRect);
      });
    
    // @todo - this is a performance hog, needs to be optimised
    // this._sBs.sink = 
    //   interval(10000).subscribe(async () => {
        // const el = this.editorContainer.nativeElement;
        // // Take a screenshot of the frame div to use as background of the mini map.
        // const viewpaneImg = await html2canvas.toJpeg(el, { quality: 0.1,  height: STORY_EDITOR_HEIGHT * this.zoomFactor, width: STORY_EDITOR_WIDTH * this.zoomFactor });
        // this.backgroundImg = `url(${viewpaneImg})`;
    // });

    // Listen to viewport changes.
    //  Draw the viewport inside the minimap to show position
    this.viewport$
      .pipe(debounceTime(10))
      .subscribe((viewport: DOMRect) => { 
      const { x, y, width, height } = viewport;

      // Apply transformation to downsize the viewport to be in line with the mini-map dimensions
      this.viewport = {
        x: x/MINI_MAP_FACTOR,
        y: y/MINI_MAP_FACTOR,

        width: width/MINI_MAP_FACTOR,
        height: height/MINI_MAP_FACTOR
      } as DOMRect;
    });
  }

  getPosition()
  {
    if(!this.viewport) 
      return '';

    return {
      position: 'absolute',
      left:   this.viewport.x * (1/this.zoomFactor)       + 'px',
      top:    this.viewport.y * (1/this.zoomFactor)       + 'px',
      width:  this.viewport.width * (1/this.zoomFactor)   + 'px',
      height: this.viewport.height * (1/this.zoomFactor)  + 'px',
    } as any;
  }

  ngOnDestroy()
  {
    this._sBs.unsubscribe();
  }
}

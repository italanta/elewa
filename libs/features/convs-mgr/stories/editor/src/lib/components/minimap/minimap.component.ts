import { Component, ElementRef, Input, OnInit } from '@angular/core';

import { Observable, debounceTime } from 'rxjs';
import html2canvas from 'html2canvas';

import { StoryEditorState } from '@app/state/convs-mgr/story-editor';
import { MINI_MAP_FACTOR, STORY_EDITOR_HEIGHT, STORY_EDITOR_WIDTH } from '../../utils/frame-size';

@Component({
  selector: 'convl-story-editor-minimap',
  templateUrl: './minimap.component.html',
  styleUrls: ['./minimap.component.scss']
})
export class StoryEditorMiniMapComponent implements OnInit //implements OnDestroy
{
  @Input() editorContainer: ElementRef<HTMLElement>;

  @Input() frameState$    : Observable<StoryEditorState>;
  @Input() viewport$      : Observable<DOMRect>;
  
  /** Base64 encoded background image */
  backgroundImg: string;

  /** Representation of the viewport within the larger editor frame */
  viewport: DOMRect;

  constructor() { }

  ngOnInit() 
  {
    // Whenever the frame changes, take a screenshot of the frame div 
    //    which acts as background image of the minimap.
    // @see https://javascript.plainenglish.io/how-to-take-a-screenshot-of-a-div-with-javascript-641576de0f74
    this.frameState$.subscribe(async () => 
    {
      const el = this.editorContainer.nativeElement;
      // Take a screenshot of the frame div to use as background of the mini map.
      const viewpaneImg = await html2canvas(el, { useCORS: true, height: STORY_EDITOR_HEIGHT, width: STORY_EDITOR_WIDTH });
      this.backgroundImg = `url(${viewpaneImg.toDataURL('image/png')}`;
    });

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
      left:   this.viewport.x + 'px',
      top:    this.viewport.y + 'px',
      width:  this.viewport.width + 'px',
      height: this.viewport.height + 'px'
    } as any;
  }

}

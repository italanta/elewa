import { AfterViewInit, Component, ElementRef, Input, OnInit } from '@angular/core';

import { Observable } from 'rxjs';
import html2canvas from 'html2canvas';

import { StoryEditorState } from '@app/state/convs-mgr/story-editor';

@Component({
  selector: 'convl-story-editor-minimap',
  templateUrl: './minimap.component.html',
  styleUrls: ['./minimap.component.scss']
})
export class StoryEditorMiniMapComponent implements OnInit, AfterViewInit //implements OnDestroy
{
  @Input() editorContainer: ElementRef<HTMLElement>;
  @Input() frameState$: Observable<StoryEditorState>;
  
  /** Base64 encoded background image */
  backgroundImg: string;

  constructor() { }

  ngOnInit() 
  {
    // Whenever the frame changes, take a screenshot of the frame div 
    //    which acts as background image of the minimap.
    // @see https://javascript.plainenglish.io/how-to-take-a-screenshot-of-a-div-with-javascript-641576de0f74
    this.frameState$.subscribe(async (state: StoryEditorState) => 
    {
      
      const el = this.editorContainer.nativeElement;
      const viewpaneImg = await html2canvas(el, { scale: 0.2 });
      this.backgroundImg = viewpaneImg.toDataURL('image/png');

      console.log(this.backgroundImg); 
    });
  }

  ngAfterViewInit() {
   
  }

}

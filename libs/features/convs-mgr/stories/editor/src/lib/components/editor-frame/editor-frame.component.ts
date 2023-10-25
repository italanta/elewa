import { AfterViewInit, Component, ElementRef, Output, EventEmitter, ViewChild, ViewContainerRef, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, filter } from 'rxjs';

import { StoryEditorState } from '@app/state/convs-mgr/story-editor';

import { StoryEditorFrame } from '../../model/story-editor-frame.model';  
import { StoryEditorInitialiserService } from '../../providers/story-editor-initialiser.service';
import { SubSink } from 'subsink';

@Component({
  selector: 'convl-story-editor-frame',
  templateUrl: './editor-frame.component.html',
  styleUrls: ['./editor-frame.component.scss']
})
export class StoryEditorFrameComponent implements AfterViewInit, OnDestroy //implements OnDestroy
{
  private _sbS = new SubSink();

  @ViewChild('editor')   editorVC: ElementRef<HTMLElement>;
  @ViewChild('viewport') viewport: ElementRef<HTMLElement>;
  @ViewChild('draw', { read: ViewContainerRef, static: true }) drawArea: ViewContainerRef;

  @Output() frameLoaded = new EventEmitter<StoryEditorFrame>;
  @Output() pinchZoom = new EventEmitter<number>();

  private _viewportBounds$$ = new BehaviorSubject<DOMRect>(null as any as DOMRect);
  /** Observable bounding box of the viewport */
  public viewportBounds$: Observable<DOMRect> = this._viewportBounds$$.pipe(filter(f => !!f));

  private _frameState$$ = new BehaviorSubject<StoryEditorState>(null as any as StoryEditorState);
  public frameState$: Observable<StoryEditorState> = this._frameState$$.pipe(filter(f => !!f));

  constructor(private _frameInitialiser: StoryEditorInitialiserService) { }


  ngAfterViewInit() {
    const frame = this._frameInitialiser.initialiseEditor(this.editorVC, this.drawArea);

    // Transfer listener for frame state changes.
    //    This transfer is necessary as the listener is initialised async and 
    //      can thus be null in the child components in case they render too fast.
    this._sbS.sink =
      frame.frameChanges$.subscribe(f => 
      {
        if(f) 
          this._frameState$$.next(f);

        this.viewPortScrolled();
      });

    this.frameLoaded.emit(frame);

    
  }

  viewPortScrolled(): void 
  { 
    const editorPosition     = this.editorVC.nativeElement.getBoundingClientRect();
    const viewportDimensions = this.viewport.nativeElement.getBoundingClientRect();
  
    const viewportBounds = {
      x: viewportDimensions.x - editorPosition.x,
      y: viewportDimensions.y - editorPosition.y,
      width: viewportDimensions.width,
      height: viewportDimensions.height
    } as DOMRect;

    this._viewportBounds$$.next(viewportBounds);
  }

  onPinch(level:number){
    this.pinchZoom.emit(level)
  }

  ngOnDestroy(): void {
    this._sbS.unsubscribe();
  }
}

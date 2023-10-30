import { AfterViewInit, Component, ElementRef, Output, EventEmitter, ViewChild, ViewContainerRef, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, debounceTime, filter } from 'rxjs';

import { StoryEditorState } from '@app/state/convs-mgr/story-editor';

import { StoryEditorFrame } from '../../model/story-editor-frame.model';  
import { StoryEditorInitialiserService } from '../../providers/story-editor-initialiser.service';
import { SubSink } from 'subsink';
import { STORY_EDITOR_HEIGHT, STORY_EDITOR_WIDTH } from '../../utils/frame-size';

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
  @Output() zoomed = new EventEmitter<number>();


  private _viewportBounds$$ = new BehaviorSubject<DOMRect>(null as any as DOMRect);
  /** Observable bounding box of the viewport */
  public viewportBounds$: Observable<DOMRect> = this._viewportBounds$$.pipe(filter(f => !!f));

  // Set frame width and height at minimum on load.
  _zoom = 1;
  frameWidth = STORY_EDITOR_WIDTH;
  frameHeight = STORY_EDITOR_HEIGHT;

  private _frame: StoryEditorFrame;
  private _frameState$$ = new BehaviorSubject<StoryEditorState>(null as any as StoryEditorState);
  public frameState$: Observable<StoryEditorState> = this._frameState$$.pipe(filter(f => !!f));

  loading = true;

  constructor(private _frameInitialiser: StoryEditorInitialiserService) { }


  ngAfterViewInit() {
    this._frame = this._frameInitialiser.initialiseEditor(this.editorVC, this.drawArea);

    // Transfer listener for frame state changes.
    //    This transfer is necessary as the listener is initialised async and 
    //      can thus be null in the child components in case they render too fast.
    // Debounce 1 second for performance issues
    this._sbS.sink =
      this._frame.frameChanges$
          .pipe(debounceTime(1000))
          .subscribe(f => 
      {
        if(f) 
          this._frameState$$.next(f);

        this.viewPortScrolled();
        
        // Release loading state after 1 second cooldown to avoid loading delays
        if(this.loading) setTimeout(() => this.loading = false, 1000);
      });

    this.frameLoaded.emit(this._frame);
    this._applyZoom();
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

  //
  // SECTION - ZOOM

  onPinch(level:number){
    return level < 0 ? this.increaseFrameZoom() : this.decreaseFrameZoom();
  }

  /** Increase the frame zoom size */
  increaseFrameZoom() {
    if (this._zoom < 1)
    {
      this._zoom = this._zoom += 0.03;
      this._applyZoom();
    }

    return this._zoom;
  }

  /** Decrease the frame zoom size */
  decreaseFrameZoom() {
    if (this._zoom >= 0.25)
    {
      this._zoom = this._zoom -= 0.03;
      this._applyZoom();
    }
    return this._zoom;
  }

  /** Apply a zoom to the story editor */
  setFrameZoom(value: number) {
    if(value >= 0.25 && value <= 1)
    {
      this._zoom = value;
      this._applyZoom();
    }

    return this._zoom;
  }

  private _applyZoom(repaint = false)
  {
    // this.viewport.nativeElement.style.transform = `scale(${this._zoom})`;
    this.editorVC.nativeElement.style.transform = `scale(${this._zoom})`;
    this._frame.setZoom(this._zoom);

    // Apply bounding box transformations
    this.frameWidth = STORY_EDITOR_WIDTH * this._zoom;
    this.frameHeight = STORY_EDITOR_HEIGHT * this._zoom;

    this.zoomed.emit(this._zoom);
  }

  // SECTION - CLEANUP
  //

  ngOnDestroy(): void {
    this._sbS.unsubscribe();
  }
}

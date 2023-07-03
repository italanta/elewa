import { AfterViewInit, Component, ElementRef, Output, EventEmitter, ViewChild, ViewContainerRef } from '@angular/core';
import interact from 'interactjs';
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
  @Output() pinchZoom = new EventEmitter<number>()

  constructor(private _frameInitialiser: StoryEditorInitialiserService) { }


  ngAfterViewInit() {
    interact('#editor-frame',)
      .draggable({
        listeners: {
          start: (event) => {
            // Check if the event target is the background element
            const isBackground = event.target.classList.contains('frame-bg');

            // Prevent dragging when the target is not the background
            if (!isBackground) {
              event.preventDefault();
            }
          },
          move: (event) => {
            const target = event.target;
            const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
            const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

            // Update the position of the background element
            target.style.transform = `translate(${x}px, ${y}px)`;

            // Store the position for the next move event
            target.setAttribute('data-x', x.toString());
            target.setAttribute('data-y', y.toString());
          }
        }
      });

    const frame = this._frameInitialiser.initialiseEditor(this.editorVC, this.viewport);

    this.frameLoaded.emit(frame);

  }

  dragMoveListener(event: Interact.DragEvent): void {
    const target = event.target;
    const x = (parseFloat(target.style.left) || 0) + event.dx;
    const y = (parseFloat(target.style.top) || 0) + event.dy;

    target.style.transform = `translate(${x}px, ${y}px)`;

    target.style.left = `${x}px`;
    target.style.top = `${y}px`;
  }


  onScroll(): void { }

  onPinch(level: number) {
    this.pinchZoom.emit(level)
  }
}

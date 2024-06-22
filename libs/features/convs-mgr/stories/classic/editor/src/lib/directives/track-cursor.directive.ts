import { Directive, HostListener } from '@angular/core';
import { DragDropService } from '../providers/drag-drop.service';

@Directive({
  selector: '[convlTrackCursor]',
})
export class TrackCursorDirective {
  constructor(private dragService: DragDropService) {}

  @HostListener('dragover', ['$event'])
  onDragOver(event: MouseEvent) {
    this.dragService.coordinates = {
      x: event.offsetX,
      y: event.offsetY,
    };
  }
}

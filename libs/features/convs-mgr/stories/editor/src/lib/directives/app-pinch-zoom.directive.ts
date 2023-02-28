import { clamp } from 'lodash';
import { Directive, HostListener, Input, OnInit, Output } from '@angular/core';
import { Subject } from 'rxjs';


@Directive({
  selector: '[convlPinchZoom]',
})
export class PinchZoomDirective implements OnInit {
  @Input() scaleFactor = 0.03;
  @Input() zoomThreshold = 2;
  @Input() initialZoom = 1;
  @Input() debounceTime = 100; // in ms
  scale: number;
  @Output() pinch$: Subject<number> = new Subject<number>();
  ngOnInit(): void {
    this.scale = this.initialZoom;
  }
  @HostListener('wheel', ['$event'])
  onWheel($event: WheelEvent) {
    if (!$event.ctrlKey) return;
    $event.preventDefault();
    let scale = this.scale - $event.deltaY * this.scaleFactor;
    scale = clamp(scale, 0.5, this.zoomThreshold);
    this.calculatePinch(scale);
  }
  calculatePinch(scale: number) {
    this.scale = scale;
    this.pinch$.next(this.scale);
  }
}

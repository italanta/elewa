import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-on-off-button',
  templateUrl: './on-off-button.component.html',
  styleUrls: ['./on-off-button.component.scss']
})
export class OnOffButtonComponent implements OnChanges {
  @Input() isOn = false;
  @Output() toggle = new EventEmitter<Event>();

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isOn']) {
      this.isOn = changes['isOn'].currentValue;
    }
  }

  onClick(event: Event): void {
    this.toggle.emit(event);
  }
}


import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: "app-item-card-row",
  templateUrl: "./item-card-row.component.html",
  styleUrls: ["./item-card-row.component.scss"],
})
export class ItemCardRowComponent
{
  @Input() selected: boolean;

  @Input() icon:   string;
  @Input() label:  string;

  @Input() actionIcon: string;

  @Output() rowClicked = new EventEmitter();

  onClick() {
    this.rowClicked.emit();
  }
}

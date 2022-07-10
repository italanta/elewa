import { Component, Output, EventEmitter } from "@angular/core";

/**
 * Standard Modal Layout
 */
@Component({
  selector: 'iote-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class UIModalComponent
{
  @Output() exit = new EventEmitter<boolean>();

  exitModal(): void {
    this.exit.emit(true);
  }
}

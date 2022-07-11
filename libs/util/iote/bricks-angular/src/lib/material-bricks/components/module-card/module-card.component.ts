import { Component, Input } from '@angular/core';

@Component({
    selector: "app-module-card",
    templateUrl: "./module-card.component.html",
    styleUrls: ["./module-card.component.scss"]
})
export class ModuleCardComponent
{
  @Input() label: string;
  @Input() sublabel: string;
  @Input() icon: string;
}

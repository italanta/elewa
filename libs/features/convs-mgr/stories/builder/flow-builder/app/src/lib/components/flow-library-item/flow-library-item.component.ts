import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-flow-library-item',
  templateUrl: './flow-library-item.component.html',
  styleUrls: ['./flow-library-item.component.scss']
})
export class FlowLibraryItemComponent
{
  @Input() label: string;
  @Input() icon: string;
  @Input() value: string;
}

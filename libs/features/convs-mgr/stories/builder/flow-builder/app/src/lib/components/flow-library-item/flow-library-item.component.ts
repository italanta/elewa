import { Component, Input } from '@angular/core';
import { FlowControl } from '../../providers/flow-controls.const';

@Component({
  selector: 'app-flow-library-item',
  templateUrl: './flow-library-item.component.html',
  styleUrls: ['./flow-library-item.component.scss']
})
export class FlowLibraryItemComponent
{
  @Input() control: FlowControl;
}

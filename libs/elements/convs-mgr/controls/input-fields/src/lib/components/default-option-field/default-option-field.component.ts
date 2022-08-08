import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { BrowserJsPlumbInstance } from '@jsplumb/browser-ui';
import { BezierConnector } from '@jsplumb/connector-bezier';

@Component({
  selector: 'app-default-option-field',
  templateUrl: './default-option-field.component.html',
  styleUrls: ['./default-option-field.component.scss'],
})
export class DefaultOptionFieldComponent implements OnInit, AfterViewInit {
  
  @Input() blockFormGroup: FormGroup;
  @Input() jsPlumb: BrowserJsPlumbInstance;

  inputUniqueId: string;

  constructor() {}

  ngOnInit(): void {
    this.inputUniqueId = `default-input-${this.blockFormGroup.value.id}`;
  }

  ngAfterViewInit(): void {
    let input = document.getElementById(this.inputUniqueId) as Element;

    if (this.jsPlumb) {
      this.jsPlumb.addEndpoint(input, {
        // Whether the anchor is source (This Block -> Other Block)
        source: true,

        // Type of endpoint to render
        endpoint: 'Dot',
        // Where to position the anchor
        anchor: 'Right',
        connector: {
          type: BezierConnector.type,
          options: {
            curviness: 100,
          },
        },
      });
    }
  }
}

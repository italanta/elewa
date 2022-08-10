import { Component, OnInit, AfterViewInit, Input} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BrowserJsPlumbInstance } from '@jsplumb/browser-ui';
import { BezierConnector } from '@jsplumb/connector-bezier';

@Component({
  selector: 'app-default-button',
  templateUrl: './default-button.component.html',
  styleUrls: ['./default-button.component.scss']
})
export class DefaultButtonComponent implements OnInit, AfterViewInit {

  @Input() blockFormGroup: FormGroup;
  @Input() jsPlumb: BrowserJsPlumbInstance;
    
   inputId: string;
    
      constructor() {}
    
 ngOnInit(): void {
   this.inputId = `default-input-${this.blockFormGroup.value.id}`;
 }
    
 ngAfterViewInit(): void {
    let input = document.getElementById(this.inputId) as Element;
    
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


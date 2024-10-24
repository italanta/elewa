import { Injectable, Type, ViewContainerRef } from '@angular/core';

import { FlowControl, FlowControlType } from '@app/model/convs-mgr/stories/flows';

import { FlowTypeTextComponent } from '../components/flow-type-text/flow-type-text.component';
import { FlowTypeInputComponent } from '../components/flow-type-input/flow-type-input.component';
import { FlowDatepickInputComponent } from '../components/flow-datepick-input/flow-datepick-input.component';
import { FlowButtonGroupComponent } from '../components/flow-button-group/flow-button-group.component';
import { FlowCheckboxOptionsComponent } from '../components/flow-checkbox-options/flow-checkbox-options.component';
import { ImageTypeInputComponent } from '../components/image-type-input/image-type-input.component';
import { TextAreaInputComponent } from '../components/text-area-input/text-area-input.component';


@Injectable({
  providedIn: 'root'
})
export class EditorComponentFactory {
  
  createEditorComponent(flowControl: FlowControl, vcr: ViewContainerRef): any {
    let componentType: Type<any>;

    switch (flowControl.controlType) {
        case FlowControlType.Header:
        case FlowControlType.LightHeader:
        case FlowControlType.Caption:
        case FlowControlType.Text: {
            componentType = FlowTypeTextComponent;
            break;
        }
        case FlowControlType.Image: {
            componentType = ImageTypeInputComponent;
            break;
        }
        case FlowControlType.TextArea:{
          componentType = TextAreaInputComponent;
            break;
        }
        case FlowControlType.Datepick: {
          componentType = FlowDatepickInputComponent;
            break;
        }
        case FlowControlType.TextInput:
          {
            componentType = FlowTypeInputComponent;
            break;
        }
        // case FlowControlType.Link: {
        //   componentType = FlowTypeLinkComponent;
        //   break;
        // }
        case FlowControlType.Radio: {
          componentType = FlowButtonGroupComponent;
          break;
        }
        case FlowControlType.Select: {
          componentType = FlowCheckboxOptionsComponent
          break;
        }
        default: {
            componentType = FlowTypeTextComponent;
            break;
        }
    }

    const componentRef = vcr.createComponent(componentType);

    return componentRef;
  }
}
import { Injectable, Type, ViewContainerRef } from '@angular/core';
import { FlowPageTextSizesV31 } from "@app/model/convs-mgr/stories/flows";
import { FlowControl, FlowControlType } from "../providers/flow-controls.const";
import { FlowTypeTextComponent } from '../components/flow-type-text/flow-type-text.component';


@Injectable({
  providedIn: 'root'
})
export class EditorComponentFactory {
  
  createEditorComponent(flowControl: FlowControl, vcr: ViewContainerRef): any {
    let componentType: Type<any>;

    switch (flowControl.type) {
        case FlowControlType.Header:
        case FlowControlType.LightHeader:
        case FlowControlType.Caption:
        case FlowControlType.Text: {
            componentType = FlowTypeTextComponent;
            break;
        }
        // case 'image': {
        //     componentType = FlowImageComponent;
        //     break;
        // }
        // case 'link': {
        //     componentType = FlowLinkComponent;
        //     break;
        // }
        // case 'select':
        // case 'checkbox':
        // case 'radio': {
        //     componentType = FlowSelectComponent;
        //     break;
        // }
        // case 'datepick': {
        //     componentType = FlowDatePickerComponent;
        //     break;
        // }
        default: {
            componentType = FlowTypeTextComponent;
            break;
        }
    }

    const componentRef = vcr.createComponent(componentType);

    // Optionally set inputs
    if (flowControl.type === FlowControlType.Header || flowControl.type === FlowControlType.LightHeader) {
      componentRef.instance.size = flowControl.type === FlowControlType.Header ? FlowPageTextSizesV31.Header : FlowPageTextSizesV31.SubHeader;
    } else if (flowControl.type === FlowControlType.Text) {
      componentRef.instance.size = FlowPageTextSizesV31.Body;
    } else if (flowControl.type === FlowControlType.Caption) {
      componentRef.instance.size = FlowPageTextSizesV31.Caption;
    }

    return componentRef;
  }
}
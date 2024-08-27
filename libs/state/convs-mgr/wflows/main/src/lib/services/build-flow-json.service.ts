import { Injectable } from "@angular/core";

import { FlowControl, FlowControlType } from "@app/features/convs-mgr/stories/builder/flow-builder/app";
import { FlowDynamicData, FlowpageForm, FlowPageLayoutElementTypesV31, FlowPageLayoutElementV31 } from "@app/model/convs-mgr/stories/flows";


@Injectable({
  providedIn: 'root',
})
export class FlowJsonBuilderService {
  constructor() {}

  buildJson(flowControls: FlowControl[]): any {
    const metaJson = flowControls.map(control => this.convertToMetaElement(control));
    return { elements: metaJson };
  }

  /** Converts FlowControls to Meta-defined elements */
  private convertToMetaElement(control: FlowControl): FlowPageLayoutElementV31 {
    switch (control.type) {
      case FlowControlType.TextInput:
      case FlowControlType.TextArea:
      case FlowControlType.Select:
      case FlowControlType.Radio:
      case FlowControlType.OptIn:
      case FlowControlType.Datepick:
        return this.buildForm(control);
      default:
        throw new Error(`Unsupported element type: ${control.type}`);
    }
  }

  /** Builds form element with children (controls) */
  private buildForm(control: FlowControl): FlowpageForm {
    return {
      type: FlowPageLayoutElementTypesV31.FORM,
      children: this.buildFormControls(control),
      "init-values": this.getInitialValues(control),
      "error-messages": this.getErrorMessages(control)
    };
  }

  /** Generates form controls based on FlowControl type */
  private buildFormControls(control: FlowControl): FlowPageLayoutElementV31[] {
    switch (control.type) {
      case FlowControlType.TextInput:
        return [{
          type: FlowPageLayoutElementTypesV31.TEXT_INPUT,
        }];
      case FlowControlType.TextArea:
        return [{
          type: FlowPageLayoutElementTypesV31.TEXT_AREA_INPUT,
        }];
      case FlowControlType.Select:
        return [{
          type: FlowPageLayoutElementTypesV31.OUTLINE_OPTIONS,
        }];
      case FlowControlType.Radio:
        return [{
          type: FlowPageLayoutElementTypesV31.INLINE_RADIO_BUTTONS,
        }];
      case FlowControlType.OptIn:
        return [{
          type: FlowPageLayoutElementTypesV31.OPT_IN,
        }];
      case FlowControlType.Datepick:
        return [{
          type: FlowPageLayoutElementTypesV31.DATE_PICKER_INPUT,
        }];
      default:
        throw new Error(`Unsupported input type: ${control.type}`);
    }
  }

  /** Gets initial values for form inputs */
  private getInitialValues(control: FlowControl): FlowDynamicData | undefined {
    // Logic to extract initial values from control (if applicable)
    return control.value || undefined;
  }

  /** Gets error messages for the form inputs */
  private getErrorMessages(control: FlowControl): { [control: string]: string } | undefined {
    // Logic to extract error messages (if applicable)
    // return control.errorMessages || undefined;
    return undefined
  }
}

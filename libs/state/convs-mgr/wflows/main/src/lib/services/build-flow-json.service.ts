import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {
  FlowPageLayoutElementTypesV31,
  FlowPageLayoutElementV31,
  FlowPageTextSizesV31,
  FlowPageTextV31,
  FlowpageForm,
} from '@app/model/convs-mgr/stories/flows';
import { FlowControl, FlowControlType } from '../providers/flow-controls.const';

@Injectable({
  providedIn: 'root',
})
export class FlowJsonBuilderService {
  private metaJsonSubject = new BehaviorSubject<any[]>([]); // Storing the JSON data

  constructor() {}

  emitMetaJson(jsonData: any): void {
    this.metaJsonSubject.next(jsonData);
  }

  /** Public method to build the JSON from FlowControls */
  buildJson(flowControls: FlowControl[]): void {
    const metaJson: any[] = [];

    let formElements: FlowControl[] = [];

    // Grouping form inputs and building the JSON structure
    flowControls.forEach((control) => {
      if (this.isInputControl(control)) {
        formElements.push(control);
      } else {
        if (formElements.length > 0) {
          metaJson.push(this.buildForm(formElements)); // Push the form when there are input controls
          formElements = [];
        }
        metaJson.push(this.convertToMetaElement(control)); // Push non-input elements
      }
    });

    // Handle case where inputs are at the end
    if (formElements.length > 0) {
      metaJson.push(this.buildForm(formElements));
    }

    // Emit the final result to the BehaviorSubject
    this.metaJsonSubject.next(metaJson);
  }

  /** Public method to subscribe to the BehaviorSubject */
  getMetaJson$() {
    return this.metaJsonSubject.asObservable();
  }

  /** Check if a FlowControl is an input element */
  private isInputControl(control: FlowControl): boolean {
    return [
      FlowControlType.TextInput,
      FlowControlType.TextArea,
      FlowControlType.Select,
      FlowControlType.Radio,
      FlowControlType.OptIn,
      FlowControlType.Datepick
    ].includes(control.type);
  }

  /** Wrap inputs into a form */
  private buildForm(inputControls: FlowControl[]): FlowpageForm {
    const children = inputControls.map((input) => this.buildInputs(input));

    return {
      type: FlowPageLayoutElementTypesV31.FORM,
      children: children,
      'init-values': this.getInitialValues(inputControls),
      'error-messages': this.getErrorMessages(inputControls),
    };
  }

  /** Get initial values for form inputs */
  // TODO: Switch back to typed
  // private getInitialValues(inputControls: FlowPageLayoutElementV31[]): any {
  private getInitialValues(inputControls: any[]): any {
    console.log(inputControls);
    const initValues: any = {};
    inputControls.forEach((control) => {
      if (control.value) {
        initValues[control.id] = control.value;
      }
    });
    return initValues;
  }

  private mapTextSize(type: FlowControlType): FlowPageTextSizesV31 {
    switch (type) {
      case FlowControlType.Header:
        return FlowPageTextSizesV31.Header;
      case FlowControlType.LightHeader:
        return FlowPageTextSizesV31.SubHeader;
      case FlowControlType.Text:
        return FlowPageTextSizesV31.Body;
      case FlowControlType.Caption:
        return FlowPageTextSizesV31.Caption;
      default:
        throw new Error(`Unsupported text size: ${type}`);
    }
  }

  convertToMetaElement(control: FlowControl) {
    switch (control.type) {
      case FlowControlType.Header:
      case FlowControlType.LightHeader:
      case FlowControlType.Text:
      case FlowControlType.Caption:
        return this.buildTextElement(control);
      case FlowControlType.Image:
        return this.buildImageElement(control);
      case FlowControlType.Link:
        return this.buildLinkElement(control);
      default:
        throw new Error(`Unsupported element type: ${control.type}`);
    }
  }
  /** Maps FlowControlType inputs to FlowPageLayoutElementV31 */
  buildInputs(flowInputs: FlowControl): FlowPageLayoutElementV31 {
    switch (flowInputs.type) {
      case FlowControlType.TextInput:
        return {
          type: FlowPageLayoutElementTypesV31.TEXT_INPUT,
        };
      case FlowControlType.TextArea:
        return {
          type: FlowPageLayoutElementTypesV31.TEXT_AREA_INPUT,
        };
      case FlowControlType.Select:
        return {
          type: FlowPageLayoutElementTypesV31.OUTLINE_OPTIONS,
        };
      case FlowControlType.Radio:
        return {
          type: FlowPageLayoutElementTypesV31.INLINE_RADIO_BUTTONS,
        };
      case FlowControlType.OptIn:
        return {
          type: FlowPageLayoutElementTypesV31.INLINE_CHECKBOX_INPUT,
        };
      case FlowControlType.Datepick:
        return {
          type: FlowPageLayoutElementTypesV31.DATE_PICKER_INPUT,
        };
      default:
        throw new Error(`Unsupported input type: ${flowInputs.type}`);
    }
  }

  /** Build a FlowPageTextV31 component */
  private buildTextElement(textElement: FlowControl): FlowPageTextV31 {
    return {
      type: FlowPageLayoutElementTypesV31.TEXT,
      text: textElement.value,
      size: this.mapTextSize(textElement.type),
    };
  }

  /** Build an Image component */
  private buildImageElement(imageElement: FlowControl): any {
    return {
      type: FlowPageLayoutElementTypesV31.IMAGE,
      url: imageElement.value,
    };
  }

  /** Build a Link component */
  private buildLinkElement(linkElement: FlowControl): any {
    return {
      type: FlowPageLayoutElementTypesV31.LINK,
      text: linkElement.value,
    };
  }

  /** Get error messages for form inputs */
  private getErrorMessages(
    inputControls: any[]
  ): { [control: string]: string } | undefined {
    return undefined;
  }
}

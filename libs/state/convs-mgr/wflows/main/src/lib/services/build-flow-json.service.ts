import { Injectable } from "@angular/core";
import { FlowPageLayoutElementTypesV31, FlowPageLayoutElementV31, FlowPageTextSizesV31, FlowPageTextV31 } from "@app/model/convs-mgr/stories/flows";
import { FlowControl, FlowControlType } from "@app/features/convs-mgr/stories/builder/flow-builder/app";


@Injectable({
  providedIn: 'root',
})
export class FlowJsonBuilderService {

  constructor() {}

  buildJson(flowControls: FlowControl[]): any {
    const metaJson = flowControls.map(control => this.convertToMetaElement(control));

    return { elements: metaJson };
  }

  /** Converting FlowControls to Meta defined types
   *  This is depended on the type prop of a FlowControl
   */
  private convertToMetaElement(control: FlowControl): FlowPageLayoutElementV31 {
    switch (control.type) {
      // Text inputs i.e elements that build a body
      case FlowControlType.Header:
      case FlowControlType.LightHeader:
      case FlowControlType.Text:
      case FlowControlType.Caption:
        return this.buildTextElement(control);
      case FlowControlType.Image:
        return this.buildImageElement(control);
      case FlowControlType.Link:
        return this.buildLinkElement(control);
        // Inputs ie elements that get data from a user.
      case FlowControlType.TextInput:
      case FlowControlType.TextArea:
      case FlowControlType.Select:
      case FlowControlType.Radio:
      case FlowControlType.OptIn:
      case FlowControlType.Datepick:
          return this.buildInputs(control);  
      default:
        throw new Error(`Unsupported element type: ${control.type}`);
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

  /** Build a FlowImage component */
  private buildImageElement(imageElement: FlowControl): any {
    return {
      type: FlowPageLayoutElementTypesV31.IMAGE,
    };
  }

  /** Build a Link component */
  private buildLinkElement(linkElement: FlowControl): any {
    return {
      type: FlowPageLayoutElementTypesV31.LINK,
    };
  }

  /** Maps FlowControlType inputs to FlowPageLayoutElementV31 */
  private buildInputs(flowInputs: FlowControl): any {
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

  /** Defining text sizes for text controls */
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
}

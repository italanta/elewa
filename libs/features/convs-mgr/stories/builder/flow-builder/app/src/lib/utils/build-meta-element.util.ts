import {
  FlowControl,
  FlowControlType,
  FlowPageLayoutElementTypesV31,
  FlowPageLayoutElementV31,
  FlowPageTextSizesV31,
  FlowPageTextV31,
} from '@app/model/convs-mgr/stories/flows';

export class BuildMetaElement {
  /** Define text sizes for text controls */
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
    switch (control.controlType) {
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
}
/** Convert non-input FlowControl to Meta-defined types */

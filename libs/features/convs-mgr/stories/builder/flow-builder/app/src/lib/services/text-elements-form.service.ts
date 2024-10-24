import { Injectable } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";

import { FlowControlType, FlowPageLayoutElementTypesV31, FlowPageTextSizesV31, FlowPageTextV31 } from "@app/model/convs-mgr/stories/flows";
import { EditableTextElement} from "../models/fe-flow-text-element.model";


@Injectable({providedIn: 'root'})

/**
 * Form and transformation service for text elements
 */
export class TextElementFormService 
{
  constructor (private _formBuilder: FormBuilder){}

  /**
   * Building a text form
   * @param textElement WhatsApp flow text element
   * @returns A form group with text element props
   */
  createTextForm(textElement: FlowPageTextV31)
  {
    return this._formBuilder.group({
      text: [textElement.text ?? ''],
      type: [textElement.type ?? ''],
      size: [textElement.size ?? '']
    })
  }
  
  /**
   * Building an empty form for when an element is absent
   * @returns form group
   */
  createEmptyForm()
  {
    return this._formBuilder.group({
      text: ['', Validators.required],
      type: ['', Validators.required],
      size: ['', Validators.required]
    })
  }

  /**
   * Function to turn form values to a valid text element object
   * @param textType Basic interface for use on F.E only, simplifies a flow control
   * @returns FlowPageTextV31
   */
  transformElement(textType: EditableTextElement): FlowPageTextV31
  {
    let textSize = FlowPageTextSizesV31.Body; // Default size
  
    // Determine the size based on the type
    switch (textType.size) {
      case FlowControlType.Header:
        textSize = FlowPageTextSizesV31.Header;
        break;
      case FlowControlType.LightHeader:
        textSize = FlowPageTextSizesV31.SubHeader;
        break;
      case FlowControlType.Text:
        textSize = FlowPageTextSizesV31.Body;
        break;
      case FlowControlType.Caption:
        textSize = FlowPageTextSizesV31.Caption;
        break;
      default:
        console.warn('Unrecognized control type, using default size.');
    }
  
    // Return the transformed FlowPageTextV31 object
    return {
      text: textType.text, 
      type: FlowPageLayoutElementTypesV31.TEXT,
      size: textSize               
    };
  }
}

      

import { FlowDynamicData } from "../dynamic-vals/dynamic-value.interface";
import { FlowPageLayoutElementTypesV31, FlowPageLayoutElementV31 } from "./flow-element.interface";

/**
 * Form element, needed for pages that take input!
 */
export interface FlowpageForm extends FlowPageLayoutElementV31
{
  /** Optional initial/default values */
  "init-values"?: FlowDynamicData;

  /** 
   * Optional error messages when an input is put wrongly 
   * 
   * key - Control name (form_field.id)
   * value - Control value
  */
  "error-messages"?: { [control: string]: string }  

  /** 
   * Form children/controls.
   * 
   * Following controls need to be inside of a form element:
   * 
   *  - TextInput
   *  - TextArea
   *  - CheckboxGroup
   *  - RadioButton
   *  - OptIn
   *  - Dropdown
   *  - DatePicker
   * 
   * @see https://developers.facebook.com/docs/whatsapp/flows/reference/flowjson#building-forms-guidelines
   */
  children: FlowPageLayoutElementV31[];

  type: FlowPageLayoutElementTypesV31.FORM;
}

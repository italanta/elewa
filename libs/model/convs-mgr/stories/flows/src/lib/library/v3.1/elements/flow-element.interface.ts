/**
 * A (layout) element of a whatsapp flow.
 * Base type, inherited by all possible layout options.
 * 
 * The screen is built out of these elements
 * @see https://developers.facebook.com/docs/whatsapp/flows/reference/flowsapi/
 */
export interface FlowPageLayoutElementV31 
{ 
  /** Type of the layout element */
  type: FlowPageLayoutElementTypesV31;

}

/**
 * List of all types our flow builder supports.
 * 
 * Max number of elements per page is 50!
 */
export enum FlowPageLayoutElementTypesV31 
{
  //
  // Structural elements

  /** Structural element indicating a form. */
  FORM = 'Form',

  /** A footer component. Basically a button requesting the next action. */
  FOOTER = 'Footer',

  /** 
   * A text header 
   *  On text types, use the 'size' attribute to determine what to send to WhatsApp API
  */
  TEXT = '__text__',

  IMAGE= 'Image',

  //
  // Input elements

  /** Text input field */
  TEXT_INPUT = 'TextInput',

  /** TExt area input */
  TEXT_AREA_INPUT ='TextArea',

  /** Date picker input */
  DATE_PICKER_INPUT = 'DatePicker',

  /** Multi select checkbox group */
  INLINE_CHECKBOX_INPUT = 'CheckboxGroup',
  
  /** Single select radio buttons */
  INLINE_RADIO_BUTTONS = 'RadioButtonsGroup',

  /** Single select options */
  OUTLINE_OPTIONS = 'Dropdown'
}
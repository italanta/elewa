export interface FeTextInput {
  name: string;
  label: string;
  required: boolean;
  type: FlowPageLayoutElementTypesV31;
}


/** 
 * Union type for different type property
 * Using this since alll three inputs are similar
 */

enum FlowPageLayoutElementTypesV31 {
  TEXT_INPUT = "text",
  TEXT_AREA_INPUT = "textarea",
  DATE_PICKER_INPUT = "datepick"
}


import { FlowPageLayoutElementV31 } from "../library/v3.1/elements/flow-element.interface";
import { FlowControlType } from "./flow-control-type.enum";
import { InputsData } from "./inputs-data.interface";

/** A single flow control */
// TODO: To extend the layout
export interface FlowControl extends FlowPageLayoutElementV31
{ 
  /** Group to which the control belongs */
  group: string;

  /** Label/name of the control */
  label: string;

  /** Value of the control */
  controlType: FlowControlType;
  
  /** Control icon */
  icon: string;

  /** Id */
  id: string;

  /** dropped */
  dropped?: boolean

  value?: any | InputsData
}
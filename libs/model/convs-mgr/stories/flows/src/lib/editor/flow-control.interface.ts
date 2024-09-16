import { FlowControlType } from "./flow-control-type.enum";
import { InputsData } from "./inputs-data.interface";

/** A single flow control */
export interface FlowControl 
{ 
  /** Group to which the control belongs */
  group: string;

  /** Label/name of the control */
  label: string;

  /** Value of the control */
  type: FlowControlType;
  
  /** Control icon */
  icon: string;

  /** Id */
  id: string;

  /** dropped */
  dropped?: boolean

  value?: any | InputsData
}
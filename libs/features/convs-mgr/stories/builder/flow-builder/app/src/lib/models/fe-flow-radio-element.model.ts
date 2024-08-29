/**
 * Interface to guide user in setting up options for a radio button. 
 */

export interface FEFlowRadioGroup 
{
  /** Radio group name */
  name: string;
  /** Radio group label */
  label: string;
  /** If it is required or not */
  required: boolean;
  /** Options in the radio group */
  options: RadioOptions[]
}

export class RadioOptions 
{
  /** Unique id for option */
  optionId: string;
  /** Label given for the option */
  label: string; 
}

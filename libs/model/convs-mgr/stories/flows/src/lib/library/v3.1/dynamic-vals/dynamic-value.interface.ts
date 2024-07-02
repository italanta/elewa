

/**
 * Dynamic data at the form level.
 */
export type FlowDynamicData =
{
  /** Name should equal the name property in the form contril */
  [name: string]: 
    /** Value to set for the control */
    string | string[];
}

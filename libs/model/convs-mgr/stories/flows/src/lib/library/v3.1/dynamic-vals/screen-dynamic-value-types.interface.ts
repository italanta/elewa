

/**
 * Dynamic data at the screen level. Example contains the value.
 */
export type FlowScreenDynamicData =
{
  /** Attribute/data name field */
  [attr_name: string]: {
    /** Attribute type */
    type: 'string' | 'number' | 'boolean' | 'object' | 'array' | string;
    /** Example attribute data. Sometimes used as actual value. */
    __example__: string | number | boolean | any | any[];
  }
}

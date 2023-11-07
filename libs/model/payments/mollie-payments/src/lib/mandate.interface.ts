export interface Mandate {
    id: string;
    method: string;
    status: MandateStatusTypes;
  }
  /**
  * The status that is returned by calling the mollie mandates api
  * @see https://docs.mollie.com/reference/v2/mandates-api/get-mandate
  */
  export enum MandateStatusTypes {
    Valid = 'valid',
    Pending = 'pending',
    Invalid = 'invalid'
  }
/**
 * Interface for the story errors
 */
export interface FlowError 
{
/** The type of the error as defined above */
  type: FlowErrorType,
  
  /** The id of the block affected by the error
  * If the type of the error is a missing connection, this will be the block
  * that the connection is supposed to originate from
  **/
  blockId: string,
}

export enum FlowErrorType {
  MissingConnection = 10,
  EmptyTextField = 20
}
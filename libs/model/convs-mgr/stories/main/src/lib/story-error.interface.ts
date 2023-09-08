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

  // The id of the option that is missing a connection in the case of multiple input options
  optionsId?: string,
}

/**
 * Enumeration representing different types of errors that can occur in a flow or story.
 */
export enum FlowErrorType {
  // Indicates a missing connection error.
  MissingConnection = 10,
   
  // Indicates an error related to an empty text field.
  EmptyTextField = 20     
}

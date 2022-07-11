/**
 * Custom exception class used across the system.
 *
 * Custom exceptions can be handled gracefully by the functions.
 * This structure allows us to build for edge cases without disrupting procedural code.
 */
export abstract class CustomException extends Error
{
  public isCustom = true;

  abstract handle() : any;
}

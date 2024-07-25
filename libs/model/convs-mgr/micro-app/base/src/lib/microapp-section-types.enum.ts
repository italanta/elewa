/**
 * In a microapp, different content is rendered depending on where a user is in the microapp
 * This interface tracks where in the microapp a user is, and renders the specific content for that position
 */
export enum MicroAppSectionTypes
{
  /** Landing page */
  Start = 1,
  /** Within an assessment */
  Main = 2,
  /** On the last page, being redirected to platform */
  Redirect = 3
}
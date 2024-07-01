/**
 * In a microapp, different content is rendered depending on where a user is in the microapp
 * This interface tracks where in the microapp a user is, and renders the specific content for that position
 */
export enum MicroAppSectionTypes
{
  Start = 1,
  Main = 2,
  Redirect = 3
}
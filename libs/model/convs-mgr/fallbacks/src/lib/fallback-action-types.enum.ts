export enum FallBackActionTypes {
  Restart = 'Restart',
  ResendLastMessage = 'ResendLastMessage',
  NextBlock = 'NextBlock',
  Route = 'Route'
}

const allEnumsArray = Object.values(FallBackActionTypes);

/** Array of Fallback action types */
export const ActionTypesArray = allEnumsArray.splice(0,(allEnumsArray.length/2));
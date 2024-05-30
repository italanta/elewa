export enum FallBackActionTypes {
  Restart = 'restart',
  ResendLastMessage = 'resendlastmessage',
  NextBlock = 'nextblock',
  Route = 'route'
}

const allEnumsArray = Object.values(FallBackActionTypes);

/** Array of Fallback action types */
export const ActionTypesArray = allEnumsArray.splice(0,(allEnumsArray.length/2));
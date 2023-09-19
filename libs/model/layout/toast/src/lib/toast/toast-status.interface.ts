
/**
 * ToastStatus to represent the structure of a toast status object.
 */
export interface ToastStatus {
    type:ToastMessageType;
}
/**
 * Enum for ToastMessageType to represent possible toast types.
 */
export enum ToastMessageType {
    Error = 'error',   // Represents an error toast.
    Success = 'success', // Represents a success toast.
  }


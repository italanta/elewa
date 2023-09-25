
/**
 * ToastStatus to represent the structure of a toast status object.
 */
export interface ToastStatus {
    type:ToastMessageTypeEnum;
}
/**
 * Enum for ToastMessageType to represent possible toast types.
 */
export enum ToastMessageTypeEnum {
    Error = 'error',   // Represents an error toast.
    Success = 'success', // Represents a success toast.
  }


import { MicroAppStatus } from "./micro-app-status.interface";

/**
 * Command to start a micro-app
 */
export interface InitMicroAppCmd 
{
  appId: string;
  endUserId: string;
  orgId: string;
}

/** 
 * Response after creating a micro-app
 */
export interface InitMicroAppResponse {
  success: boolean;
  message: string;
  status?: MicroAppStatus;
  navigateUrl: string;
}
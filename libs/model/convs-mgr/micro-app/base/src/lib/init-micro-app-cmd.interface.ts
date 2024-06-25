import { MicroAppStatus } from "./micro-app-status.interface";

/**
 * Command to start a micro-app
 */
export interface InitMicroAppCmd 
{
  appId: string;
  // endUserId: string;
  // orgId: string;
}

/** 
 * Response after creating a micro-app
 */
export interface InitMicroAppResponse 
{
  /** Whether we managed to retrieve the app */
  success: boolean;

  /** The app */
  app: MicroAppStatus;
  
  /** In case of error, clarify message */
  error?: string;
}
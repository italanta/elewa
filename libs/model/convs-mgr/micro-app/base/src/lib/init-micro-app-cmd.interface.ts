import { MicroAppStatus } from "./micro-app-status.interface";

export interface InitMicroAppCmd {
  appId: string;
  endUserId: string;
  orgId: string;
}

export interface InitMicroAppResponse {
  success: boolean;
  message: string;
  status?: MicroAppStatus
}
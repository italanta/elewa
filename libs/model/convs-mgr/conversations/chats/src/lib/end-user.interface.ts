import { IObject } from "@iote/bricks";

export interface EndUser extends IObject
{
    name                : string;

    phoneNumber         : string;
    
    status              : ChatStatus
}

export enum ChatStatus {
    Running               = 'running',
    Paused                = 'paused',
    TakingToOperator      = 'takingtooperator',
    Ended                 = 'ended'
  }
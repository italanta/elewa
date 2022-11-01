import { IObject } from '@iote/bricks';

import { PlatformType } from '@app/model/convs-mgr/conversations/admin/system';

/**
 * 
 */
  export interface Chat extends IObject
  {
    status: ChatStatus;
  }
  
  export enum ChatStatus {
    Running               = 'running',
    Paused                = 'paused',
    TakingToOperator      = 'takingtooperator',
    Ended                 = 'ended'
  }
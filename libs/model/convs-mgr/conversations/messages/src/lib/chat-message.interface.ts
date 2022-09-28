import { IObject } from '@iote/bricks';

import { Platforms } from '@app/model/convs-mgr/conversations/admin/system';

  export interface Chat extends IObject{
    chatId: string;
    status: ChatStatus;
    platform: Platforms;
  
  }
  
  export enum ChatStatus {
    Running           = 0,
    Paused            = 5,
    ChatWithOperator  = 10,
    Ended             = 15
  }
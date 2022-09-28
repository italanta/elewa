import { Platforms } from '@app/model/convs-mgr/conversations/admin/system';
import { IObject } from '@iote/bricks';

export interface Message extends IObject {
  phoneNumber   : string;
  platform      : Platforms;
  message       : string;
}
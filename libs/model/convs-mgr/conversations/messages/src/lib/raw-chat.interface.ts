import { Platforms } from '@app/model/convs-mgr/conversations/admin/system';
import { IObject } from '@iote/bricks';


export interface RawMessageData extends IObject{
  // id            : string;
  businessNumber: string;
  phoneNumber   : string;
  platform      : Platforms;
  message       : string;
}
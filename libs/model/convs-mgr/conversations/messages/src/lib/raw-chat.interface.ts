import { Platforms } from '@app/model/convs-mgr/conversations/admin/system';


export interface RawMessageData {
  id            : string;
  phoneNumber   : string;
  platform      : Platforms;
  message       : string;
}
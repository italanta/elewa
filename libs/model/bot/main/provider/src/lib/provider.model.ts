import { IObject } from '@iote/bricks';
import{Platforms} from '@app/model/convs-mgr/conversations/admin/system';


export interface Provider extends IObject {
  id        : string;
  orgId     : string;
  storyId   : string;
  platform  : Platforms;
}
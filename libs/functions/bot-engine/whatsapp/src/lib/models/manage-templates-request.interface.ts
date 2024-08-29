import { TemplateMessage } from "@app/model/convs-mgr/conversations/messages";


export interface ManageTemplateRequest
{
  /** The type of operation to perform */
  action: ActionTypes;
  template: TemplateMessage;
  channelId: string;
}

export enum ActionTypes
{
  Create = 'create',
  Update = 'update',
  Delete = 'delete'
}
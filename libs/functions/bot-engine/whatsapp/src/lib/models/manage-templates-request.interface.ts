import { MessageTemplate } from "@app/model/convs-mgr/functions";

export interface ManageTemplateRequest
{
  /** The type of operation to perform */
  action: ActionTypes;
  template: MessageTemplate;
  channelId: string;
}

export enum ActionTypes
{
  Create = 'create',
  Update = 'update',
  Delete = 'delete'
}
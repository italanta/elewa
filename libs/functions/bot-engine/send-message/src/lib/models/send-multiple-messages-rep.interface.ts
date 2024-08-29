import { EnrolledEndUser } from "@app/model/convs-mgr/learners";

export interface SendMultipleMessagesResp 
{
  /** The total number of messages attempted to send */
  attempted?: number;

  /** The phone numbers/receipient IDs of the users who were successful */
  usersSent?: EnrolledEndUser[];
  /** The phone numbers/receipient IDs of the userswho were not successful */
  usersFailed?: EnrolledEndUser[];

  error?: any;
}
export interface SendMultipleMessagesResp 
{
  /** The total number of messages attempted to send */
  attempted?: number;

  /** The phone numbers/receipient IDs of the users who were successful */
  usersSent?: string[];
  /** The phone numbers/receipient IDs of the userswho were not successful */
  usersFailed?: string[];

  error?: any;
}
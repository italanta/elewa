import { IObject } from "@iote/bricks";

/**
 * The first time a user sends a message to our bot, we generate a unique id {platform_n_endUserPhoneNumber} @see {CommunicationChannel.n}
 *      We then save the end user's information in 'end-users/{end-user-id}'
 * 
 *  This information allows us to track the status of the ongoing chat between the end user and our chatbot
 */
export interface EndUser extends IObject
{
    /** The name of the end user chatting with our bot */
    name?               : string;

    /** The phone number of the end user chatting with our bot */
    phoneNumber         : string;

    /** The current status of the ongoing chat between the end user and our chatbot */
    status              : ChatStatus;

    /** The story that the end user is currently responding to */
    currentStory       ?: string;
}

/**
 * The current status of the ongoing chat between the end user and our chatbot
 * 
 * We need this so that we can be able to manage the conversation, e.g. pause the chat or 
 *  allow the user to communicate directly with the operator/agent
 */
export enum ChatStatus 
{
    Running               = 'running',

    Paused                = 'paused',

    PausedByAgent         = 'takingtoagent',

    Ended                 = 'ended',

    Stashed               = 'stashed',

    Disabled              = 'disabled'
  }
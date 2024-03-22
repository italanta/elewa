import { IObject } from "@iote/bricks";

import { AssessmentResult } from "@app/model/convs-mgr/conversations/admin/system";

/**
 * The first time a user sends a message to our bot, we generate a unique id {platform_n_endUserPhoneNumber} @see {CommunicationChannel.n}
 *      We then save the end user's information in 'end-users/{end-user-id}'
 * 
 *  This information allows us to track the status of the ongoing chat between the end user and our chatbot
 */
export interface EndUser extends IObject
{
    /** The name of the end user chatting with our bot */
    name?                          : string;

    /** The phone number of the end user chatting with our bot */
    phoneNumber?                   : string;

    /** The current status of the ongoing chat between the end user and our chatbot */
    status                        ?: ChatStatus;

    /** The story that the end user is currently responding to */
    currentStory                  ?: string;

    labels                        ?:string[];

    isConversationComplete        ?: number;

    /** The values of the variables that the end user has provided */
    variables                     ?: {[key:string]:any};

    /** 
     * Learner Preferences required to launch an AU. However The LMS (CLM) MAY choose to ignore or 
     *      override Learner Preference changes requested by the AU by returning a "403 Forbidden" 
     *          response as defined in the xAPI specification.
     * 
     * @see https://github.com/AICC/CMI-5_Spec_Current/blob/quartz/cmi5_spec.md#xapi_agent_profile
     * */
    learnerPreferences           ?: LearnerPreferences;

    /** The results of the assessments that the end user has taken */
    assessmentResults             ?: AssessmentResult[];

    lastActiveTime                ?: Date;

    enrolledUserId                ?: string;
}


/** 
 * Learner Preferences required to launch an AU. However The LMS (CLM) MAY choose to ignore or 
 *      override Learner Preference changes requested by the AU by returning a "403 Forbidden" 
 *          response as defined in the xAPI specification.
 * 
 * @see https://github.com/AICC/CMI-5_Spec_Current/blob/quartz/cmi5_spec.md#xapi_agent_profile
 * */
export interface LearnerPreferences {
    /** In the list, languages MUST be specified in order of user preference 
     * e.g. "en-US,fr-FR,fr-BE" */
    languagePreference            ?: string;

    /** The audioPreference value indicates whether the audio SHOULD be "on" or "off" */
    audioPreference               ?: string;
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